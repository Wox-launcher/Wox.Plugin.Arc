import type { Context, Plugin, PluginInitParams, PublicAPI, Query, Result } from "@wox-launcher/wox-plugin"
import { getTabs, isArcInstalled, selectTab } from "./arc"
import { Tab } from "./types"

let api: PublicAPI
let tabs: Tab[]

export const plugin: Plugin = {
  init: async (ctx: Context, initParams: PluginInitParams) => {
    api = initParams.API

    setInterval(async () => {
      if (await isArcInstalled()) {
        const openTabs = await getTabs()
        if (openTabs == undefined) {
          return
        }

        tabs = openTabs
      } else {
        tabs = []
      }
    }, 2000)
  },

  query: async (ctx: Context, query: Query): Promise<Result[]> => {
    if (tabs == undefined || tabs.length == 0) {
      return []
    }

    // Only show the plugin when the user is in the Arc window in global mode
    if (query.IsGlobalQuery() && query.Env.ActiveWindowTitle.toLowerCase() != "arc") {
      return []
    }

    return tabs.filter(o => o.title.toLowerCase().includes(query.Search.toLowerCase()) || o.url.toLowerCase().includes(query.Search.toLowerCase())).map(tab => {
      return {
        Title: tab.title,
        SubTitle: tab.url,
        Icon: {
          ImageType: "relative",
          ImageData: "images/app.png"
        },
        Actions: [
          {
            Name: "Open",
            Action: async () => {
              await selectTab(tab)
              await api.Log(ctx, "Info", `Opening tab: ${tab.title}`)
            }
          }
        ]
      }
    })
  }
}
