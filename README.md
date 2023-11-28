# Secure Real Time Multiplayer Game

[![Run on Repl.it](https://replit.com/badge/github/The-Aldi-Tri/secure-real-time-multiplayer-game)](https://replit.com/new/github/The-Aldi-Tri/secure-real-time-multiplayer-game)

*You need an account on Replit


## FreeCodeCamp - Information Security Certification Projects

Instructions for building the project can be found at https://www.freecodecamp.org/learn/information-security/information-security-projects/secure-real-time-multiplayer-game.


## Assignment

Develop a 2D real time multiplayer game using the HTML Canvas API and Socket.io that is functionally similar to this: [https://secure-real-time-multiplayer-game.freecodecamp.rocks/](https://secure-real-time-multiplayer-game.freecodecamp.rocks/). Working on this project will involve you writing your code using one of the following methods:

*   Clone [this GitHub repo](https://github.com/freeCodeCamp/boilerplate-project-secure-real-time-multiplayer-game/) and complete your project locally.
*   Use [our Replit starter project](https://replit.com/github/freeCodeCamp/boilerplate-project-secure-real-time-multiplayer-game) to complete your project.
*   Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.

If you use Replit, follow these steps to set up the project:

*   Start by importing the project on Replit.
*   Next, you will see a `.replit` window.
*   Select `Use run command` and click the `Done` button.

When you are done, make sure a working demo of your project is hosted somewhere public. Then submit the URL to it in the Solution Link field. Optionally, also submit a link to your project's source code in the GitHub Link field.

---

Create a secure multiplayer game in which each player can move their avatar, there is at least one collectible item, and the rank of the players is calculated based on their score.

For details consult the tests below.

Make sure that your game is secure! Include these security measures:

*   The client should not be able to guess/sniff the MIME type
*   Prevent XSS attacks
*   Do not cache anything from the website in the client
*   The headers say that the site is powered by `PHP 7.4.3`

**Note**: `helmet@^3.21.3` is needed for the user stories. This means you will need to use the previous version of Helmet's docs, for information on how to achieve the user stories.
