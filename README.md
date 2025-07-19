# Ranked Tourney Host
A site to automatically tabulate results all via the Ranked API.

## Getting an event created
To get an event created, message **Specnr** on Discord with the name of your event, and the date.

This piece will not be automated to avoid spaming event creation.

## Building an event
There are two building blocks to an event, the format, and the match list.

### Format
The format defines how the event is tabulated. This is represented in the form of a query string using function(s) to do different operations, seperated by a semicolon.

This is a list of the current valid functions:
- **POINTS**
  - The player's position in each round earns them points, which are added up to determine overall result.
  - This is mutually exclusive with **AVG**.
  - Parameters:
    - first [int]: # of points for the first completion
    - last [int]: # of points for the last completion (usually 1)
    - max [int?]: Optional. The max number of possible completions set in the ranked lobby
- **AVG**
  - The average time over all matches will be used to calculate player's overall position.
  - This is mutually exclusive with **POINTS**.
  - Parameters:
    - N/A
- **DROP**
  - Drops player's top x best placement(s) and / or bottom y worst placement(s)
  - This only works with **AVG**
  - Parameters:
    - high: # of high rounds to drop
    - low: # of low rounds to drop
  - NOTE: if there are less than high + low + 1 rounds finished, this will be ignored

Examples of valid query strings:
- POINTS(20,1,24)
  - Uses the **POINTS** function with a 20 point first place, 1 point last place, and max of 24 possible player completions.
  
- AVG;DROP(1,1)
  - Uses the **AVG** function, along with the **DROP** function, dropping players best and worst placed rounds.

### Match List
The match list is built on the RTH website's admin portal. Here you enter your tourney's secret code to log in. Then put in the Ranked lobby's host's IGN, this will bring up all of their recently completed lobbys, where you can add them in order to the match list.

This can be done as soon as each round is completed, so I would reccomend to give this job to the lobby host for they tournament.

### TODO:
- Cache tourney results more, unless we are then pog (i forget)