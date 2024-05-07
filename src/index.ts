import type { Plugin, PluginInitContext, PublicAPI, Query, Result } from "@wox-launcher/wox-plugin"

let api: PublicAPI

export const plugin: Plugin = {
  init: async (context: PluginInitContext) => {
    api = context.API
    await api.Log("Info", "Init finished")
  },

  query: async (query: Query): Promise<Result[]> => {
    return [
      {
        Title: "Hello World",
        SubTitle: "This is a subtitle",
        Icon: {
          ImageType: "relative",
          ImageData: "images/app.png"
        },
        Actions: [
          {
            Name: "Open",
            Action: async () => {
              await api.ChangeQuery({
                QueryType: "input",
                QueryText: "Hello World!"
              })
            }
          }
        ]
      }
    ]
  }
}
