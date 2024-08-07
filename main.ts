import { renderToString } from "npm:preact-render-to-string";
import { h } from "npm:preact";

Deno.serve(async (request) => {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return new Response("Please provide a URL", { status: 400 });
  }
  const json: ReadonlyArray<{ id: string; markers: ReadonlyArray<{}> }> =
    await (await fetch(url)).json();

  return new Response(
    renderToString(h("html", {}, [
      h("head", {}, [
        h("title", {}, `marker view ${url}`),
      ]),
      h("body", {}, [
        h("h1", {}, "Hello, Deno!"),
      ]),
    ])),
    {
      headers: { "content-type": "text/html; charset=UTF-8" },
    },
  );
});
