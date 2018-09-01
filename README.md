###### project01 (Trof) pro tem

### Getting Started

### Setting up your development environment

Recommended OS: **Mac OS Mojave**, **Windows 10** or **Linux Ubuntu 18.04 LTS**

## Install Firebase

For `firebase init` you will need to follow the CLI prompts to initialize the Trof project. The project ID is `newsocialnetwork-ce19e`

```
$ npm install -g firebase-tools
$ firebase init    # Generate a firebase.json (REQUIRED) this is where you will need to use the project ID
```

Generate the files as recommended with the default names.

## Development

To begin a development session, open Terminal.

> If you are using Windows, you will use Command Prompt instead of Terminal. One of the quickest ways to launch the Command Prompt, in any modern version of Windows, is to use the Run window. A fast way to launch this window is to press the Win + R keys on your keyboard. Then, type cmd or cmd.exe and press Enter or click/tap OK.

Navigate to the root directory of the project using the change directory command.

1. `cd project01`

2. `firebase serve`

A local server will be created and will serve hosting files at http://localhost:5000.

In your text editor/code editor/IDE of choice, open the `public` folder, which will be within the root `project01` folder. This will display all files within that folder. Alternatively, you can just open a single file in the `public` folder.

To view your changes, simply save the file you have edited, and refresh the localhost server in the browser.

Use your preferred Git version control software such as **Sourcetree** to pull, push and commit your files to Github. Consult the Sourcetree official documentation for more information and how to go about this: https://confluence.atlassian.com/get-started-with-sourcetree. Note that Sourcetree is currently not supported for Linux operating systems.

## Deploy

Save all files, and push & commit all changes in Github. Be sure to fully comment your updates. 

To deploy, terminate the localhost server process and run `firebase deploy` in the CLI (Command Line Interface). The current project will build, which may take a couple minutes.

Your changes will be live at https://beta.trofapp.com.


### Disclaimer

IN NO EVENT SHALL THE AUTHORS, DEVELOPERS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THIS SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
