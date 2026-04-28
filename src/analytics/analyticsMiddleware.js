import { trackReduxAsyncLifecycle } from "./webAnalytics";

const ASYNC_SUFFIXES = ["/pending", "/fulfilled", "/rejected"];

const splitLifecycle = (actionType = "") => {
  const suffix = ASYNC_SUFFIXES.find((item) => actionType.endsWith(item));
  if (!suffix) return null;
  return {
    baseType: actionType.slice(0, -suffix.length),
    lifecycle: suffix.replace("/", ""),
  };
};

const lifecycleToStatus = (lifecycle) => {
  if (lifecycle === "pending") return "pending";
  if (lifecycle === "fulfilled") return "success";
  if (lifecycle === "rejected") return "failed";
  return "info";
};

export const analyticsMiddleware = () => (next) => (action) => {
  const result = next(action);
  const actionType = typeof action?.type === "string" ? action.type : "";
  const parsed = splitLifecycle(actionType);

  if (parsed && !parsed.baseType.startsWith("analytics/")) {
    trackReduxAsyncLifecycle({
      actionType: parsed.baseType,
      lifecycle: parsed.lifecycle,
      status: lifecycleToStatus(parsed.lifecycle),
      errorMessage: action?.error?.message || action?.payload,
    });
  }

  return result;
};
