import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../config/api";

export const sendAnalyticsEventBatch = createAsyncThunk(
  "analytics/sendBatch",
  async (events = [], { rejectWithValue }) => {
    try {
      const safeEvents = Array.isArray(events) ? events : [];
      if (!safeEvents.length) return { success: true, recorded: 0 };

      const response = await fetch(`${API_URL}/api/analytics/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: safeEvents }),
        keepalive: true,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Failed to send analytics events");
      }

      return {
        success: true,
        recorded: Number(data?.recorded || safeEvents.length),
      };
    } catch (error) {
      return rejectWithValue(
        error?.message || "Unable to send analytics events",
      );
    }
  },
);

