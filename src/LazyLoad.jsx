import React from "react";

// render this instead of <Component /> while developing / testing <Fallback />
const SuspenseTrigger = () => {
  throw new Promise(() => {});
};

export default function LazyLoad({
  load,
  fallback: FallbackComponent,
  ...props
}) {
  const [Component, setComponent] = React.useState(() => FallbackComponent);

  React.useEffect(() => {
    setComponent(() => React.lazy(load));
  }, []);

  return (
    <React.Suspense fallback={<FallbackComponent />}>
      <Component {...props} />
    </React.Suspense>
  );
}
