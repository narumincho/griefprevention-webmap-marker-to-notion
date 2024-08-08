import { renderToString } from "npm:preact-render-to-string";
import { h } from "npm:preact";

Deno.serve(async (request) => {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return new Response("Please provide a URL", { status: 400 });
  }
  const json: ReadonlyArray<
    {
      readonly id: string;
      readonly markers: ReadonlyArray<
        {
          readonly type: string;
          readonly points?: ReadonlyArray<{ x: number; z: number }>;
          readonly popup?: string;
        }
      >;
    }
  > = await (await fetch(url)).json();

  const griefpreventionMarkers = json.find((markerGroup) =>
    markerGroup.id === "griefprevention"
  )?.markers;

  if (!griefpreventionMarkers) {
    return new Response("No griefprevention markers found", { status: 404 });
  }

  return new Response(
    renderToString(h("html", {}, [
      h("head", {}, [
        h("title", {}, `marker view ${url}`),
      ]),
      h(
        "body",
        {},
        griefpreventionMarkers.map((marker) => {
          if (marker.type !== "rectangle") {
            return h("div", {}, `markerType: ${marker.type}`);
          }
          const [point1, point2] = marker.points ?? [];
          if (!point1 || !point2) {
            return h("div", {}, "invalid marker");
          }
          return h(
            "div",
            {},
            `size: ${
              (Math.abs(point1.x - point2.x) + 1) *
              (Math.abs(point1.z - point2.z) + 1)
            }`,
          );
        }),
      ),
    ])),
    {
      headers: { "content-type": "text/html; charset=UTF-8" },
    },
  );
});
