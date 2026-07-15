/**
 * Sample fallback content for the API-backed sections (Events, Groups, My
 * Videos, Podcast, Audio).
 *
 * These sections fetch their real items from the backend at render time, but
 * until a source slug is set (or while the API returns nothing) we render this
 * demo data so the design is always visible — matching the rest of the builder,
 * where a freshly-added block is never a blank white screen. Real API items
 * always take priority over these.
 */

import {
  DEFAULT_WAVEFORM as WAVEFORM,
  type AudioTrackItem,
  type EventItem,
  type GroupItem,
  type VideoItem,
} from "@/lib/section-api";

export const SAMPLE_EVENTS: EventItem[] = [
  {
    id: "sample-event-1",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80",
    title: "Summer Music Festival 2025",
    channel: "Live Nation",
    views: "12K interested",
    release: "Aug 14, 2025",
  },
  {
    id: "sample-event-2",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    title: "Founders & Coffee Meetup",
    channel: "Startup Grind",
    views: "480 going",
    release: "Sep 02, 2025",
  },
  {
    id: "sample-event-3",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    title: "Design Systems Conference",
    channel: "UX Collective",
    views: "3.1K interested",
    release: "Oct 21, 2025",
  },
];

export const SAMPLE_GROUPS: GroupItem[] = [
  {
    id: "sample-group-1",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
    title: "Product Designers Community",
    members: "8,420 members",
  },
  {
    id: "sample-group-2",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80",
    title: "Frontend Developers",
    members: "12,905 members",
  },
  {
    id: "sample-group-3",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80",
    title: "Weekend Photographers",
    members: "3,140 members",
  },
  {
    id: "sample-group-4",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80",
    title: "Founders Network",
    members: "1,760 members",
  },
];

export const SAMPLE_VIDEOS: VideoItem[] = [
  {
    id: "sample-video-1",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    title: "Behind the Scenes",
    youtubeId: "dQw4w9WgXcQ",
    date: "Jun 18, 2025",
    location: "Los Angeles, CA",
  },
  {
    id: "sample-video-2",
    image:
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=600&q=80",
    title: "Product Launch Recap",
    youtubeId: "dQw4w9WgXcQ",
    date: "May 09, 2025",
    location: "New York, NY",
  },
  {
    id: "sample-video-3",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80",
    title: "Studio Session",
    youtubeId: "",
    date: "Apr 27, 2025",
    location: "Austin, TX",
  },
  {
    id: "sample-video-4",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
    title: "City Timelapse",
    youtubeId: "dQw4w9WgXcQ",
    date: "Mar 15, 2025",
    location: "Chicago, IL",
  },
];

export const SAMPLE_TRACKS: AudioTrackItem[] = [
  {
    id: "sample-track-1",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80",
    title: "The Creative Mindset",
    subtitle: "Episode 12 · with Ava Reyes",
    date: "Jul 01, 2025",
    waveform: WAVEFORM,
    duration: "32:14",
  },
  {
    id: "sample-track-2",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80",
    title: "Building in Public",
    subtitle: "Episode 11 · with Sam Cole",
    date: "Jun 24, 2025",
    waveform: WAVEFORM,
    duration: "28:45",
  },
  {
    id: "sample-track-3",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    title: "Sound & Story",
    subtitle: "Episode 10 · with Priya N.",
    date: "Jun 17, 2025",
    waveform: WAVEFORM,
    duration: "41:02",
  },
];
