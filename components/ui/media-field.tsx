"use client";

import { useId, useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { useMediaUpload, type MediaKind } from "@/hooks/useMediaUpload";
import { Field } from "./field";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface BaseProps {
  label: string;
  /** Whether the picker takes images or videos. */
  kind?: MediaKind;
  hint?: string;
  error?: string;
  className?: string;
  /** Longest edge an uploaded image is downscaled to. Logos want this small. */
  maxDimension?: number;
  placeholder?: string;
}

type MediaFieldProps = BaseProps &
  (
    | { multiple?: false; value: string; onChange: (value: string) => void }
    | { multiple: true; value: string[]; onChange: (value: string[]) => void }
  );

/**
 * One media control for every editor: paste a URL or upload a file, with a
 * preview and a remove button.
 *
 * `multiple` switches it between a single value (string) and a list (string[]);
 * in list mode uploads append and each entry can be removed on its own, which
 * is what carousels and galleries need.
 */
/** True for values that came from a file picker rather than a typed URL. */
const isUploaded = (value?: string) =>
  !!value && (value.startsWith("data:") || value.startsWith("blob:"));

export function MediaField(props: MediaFieldProps) {
  const {
    label,
    kind = "image",
    hint,
    error,
    className,
    maxDimension,
    placeholder = "https://…",
  } = props;

  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [draftUrl, setDraftUrl] = useState("");
  const { readFiles, uploading, error: uploadError, accept } = useMediaUpload({
    kind,
    ...(maxDimension ? { maxDimension } : {}),
  });

  const values = props.multiple ? props.value ?? [] : props.value ? [props.value] : [];

  const commit = (next: string[]) => {
    if (props.multiple) props.onChange(next);
    else props.onChange(next[next.length - 1] ?? "");
  };

  const handleFiles = async (fileList: FileList | null) => {
    const uploaded = await readFiles(fileList);
    // Let the same file be picked again after a remove.
    if (fileRef.current) fileRef.current.value = "";
    if (!uploaded.length) return;
    commit(props.multiple ? [...values, ...uploaded] : uploaded.slice(-1));
  };

  const addUrl = () => {
    const url = draftUrl.trim();
    if (!url) return;
    setDraftUrl("");
    commit(props.multiple ? [...values, url] : [url]);
  };

  return (
    <Field
      label={label}
      htmlFor={inputId}
      error={error ?? uploadError ?? undefined}
      hint={hint}
      className={className}
    >
      <div className="flex gap-2">
        {props.multiple ? (
          // A list needs an "add" box: typing must not disturb existing entries.
          <Input
            id={inputId}
            value={draftUrl}
            placeholder={placeholder}
            onChange={(e) => setDraftUrl(e.target.value)}
            onBlur={addUrl}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
        ) : (
          // A single value edits in place, so the field shows what's stored —
          // except for uploads, whose data/blob URLs are unreadable as text.
          <Input
            id={inputId}
            value={isUploaded(props.value) ? "" : props.value ?? ""}
            placeholder={isUploaded(props.value) ? "Uploaded file" : placeholder}
            readOnly={isUploaded(props.value)}
            onChange={(e) => props.onChange(e.target.value)}
          />
        )}
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        multiple={props.multiple}
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {values.length > 0 && (
        <div className={cn("mt-1 flex flex-wrap gap-2", !props.multiple && "flex-col")}>
          {values.map((src, i) => (
            <div
              key={`${src.slice(0, 40)}-${i}`}
              className="group relative overflow-hidden rounded-md border border-zinc-200 bg-white"
            >
              {kind === "video" ? (
                <video src={src} controls className="h-32 w-56 object-cover" />
              ) : (
                <img src={src} alt="" className="h-24 w-24 object-cover" />
              )}
              <button
                type="button"
                aria-label="Remove"
                onClick={() => commit(values.filter((_, index) => index !== i))}
                className="absolute right-1 top-1 rounded bg-white/90 p-1 text-red-500 shadow-sm hover:bg-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Field>
  );
}
