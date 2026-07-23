"use client";

import { useCallback, useState } from "react";
import { uploadBase64ToS3 } from "@/lib/asset-upload";

export type MediaKind = "image" | "video";

export interface UseMediaUploadOptions {
  /** What the picker accepts. Images become data URLs; videos become object URLs. */
  kind?: MediaKind;
  /** Longest edge, in px, an uploaded image is downscaled to before it's stored. */
  maxDimension?: number;
  /** Reject files bigger than this (checked before any reading happens). */
  maxSizeMb?: number;
}

/**
 * Turns picked files into strings the editors can store, so every editor gets
 * the same "paste a URL or upload a file" behaviour instead of hand-rolling
 * FileReader plumbing.
 *
 * Images are downscaled and returned as data URIs, matching how the rest of the
 * app works: content holds the data URI and `uploadSnapshotAssets` swaps it for
 * an S3 URL at publish time (see lib/asset-upload.ts). A video is far too big to
 * carry around in the snapshot, so it goes to S3 straight away and only its URL
 * is stored.
 */
export function useMediaUpload({
  kind = "image",
  maxDimension = 1600,
  maxSizeMb = kind === "video" ? 25 : 10,
}: UseMediaUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = kind === "video" ? "video/*" : "image/*";

  /**
   * Reads an <input type="file"> change event and resolves to one string per
   * accepted file. Files of the wrong type or over the size cap are skipped and
   * reported through `error` rather than thrown, so a bad file in a multi-select
   * doesn't lose the good ones.
   */
  const readFiles = useCallback(
    async (fileList: FileList | null): Promise<string[]> => {
      const files = Array.from(fileList ?? []);
      if (!files.length) return [];

      setUploading(true);
      setError(null);

      const rejected: string[] = [];
      const results: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith(`${kind}/`)) {
          rejected.push(`${file.name} is not a ${kind}`);
          continue;
        }
        if (file.size > maxSizeMb * 1024 * 1024) {
          rejected.push(`${file.name} is over ${maxSizeMb}MB`);
          continue;
        }

        try {
          if (kind === "video") {
            const dataUri = await readAsDataUrl(file);
            results.push(await uploadBase64ToS3(dataUri, file.name));
          } else {
            results.push(await downscaleImage(file, maxDimension));
          }
        } catch (e) {
          rejected.push(
            `${file.name}: ${e instanceof Error ? e.message : "could not be read"}`,
          );
        }
      }

      if (rejected.length) setError(rejected.join(", "));
      setUploading(false);
      return results;
    },
    [kind, maxDimension, maxSizeMb],
  );

  return { readFiles, uploading, error, clearError: () => setError(null), accept };
}

/**
 * Draws the file through a canvas at a capped size. PNGs and SVGs come back as
 * PNG so transparency survives; everything else becomes JPEG, which keeps photo
 * data URLs an order of magnitude smaller.
 */
function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("could not be read"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

function downscaleImage(file: File, maxDimension: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("could not be read"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("is not a readable image"));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas context"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const keepsAlpha = file.type === "image/png" || file.type === "image/svg+xml";
        resolve(
          keepsAlpha
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", 0.85),
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
