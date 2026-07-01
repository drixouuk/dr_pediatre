> ## Documentation Index
>
> Fetch the complete documentation index at: https://cal.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Embed Events

<Info>
  For comprehensive documentation on embed events including usage examples and all available events, please refer to the [Cal.com Help Center - Embed Events](https://cal.com/help/embedding/embed-events).
</Info>

## Internal Events

These events are used internally by the embed system for communication between the iframe and parent window. They are prefixed with `__` and are not intended for external use.

| Action                 | Description                                                                 | Properties                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| \_\_iframeReady        | Fired when the embedded iframe is ready to communicate with parent snippet. | `isPrerendering: boolean` // Whether the iframe is in prerender mode                                                            |
| \_\_windowLoadComplete | Tells that window load for iframe is complete.                              | None                                                                                                                            |
| \_\_dimensionChanged   | Tells that dimensions of the content inside the iframe changed.             | `iframeWidth: number` <br /> `iframeHeight: number` <br /> `isFirstTime: boolean` // Whether this is the first dimension change |
| \_\_routeChanged       | Fired when the route changes within the iframe.                             | None                                                                                                                            |
| \_\_closeIframe        | Fired when the iframe should be closed.                                     | None                                                                                                                            |
| \_\_connectInitiated   | Fired when connection to a prerendered iframe is initiated.                 | None                                                                                                                            |
| \_\_connectCompleted   | Fired when connection to a prerendered iframe is completed.                 | None                                                                                                                            |
| \_\_scrollByDistance   | Instructs the parent to scroll by a specific distance.                      | `distance: number` // Distance in pixels to scroll by                                                                           |

<Info>Events that start with `__` are internal and should not be relied upon for external integrations as they may change without notice.</Info>

To get more details on how Embed actually works, you can refer to this [Embed Flowchart](https://www.figma.com/file/zZ5oaUpg12Fuu5mGZrPlP5/Embed-Flowchart).
