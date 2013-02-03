Pageflipper will flip multiple browsers through a series of urls in sync.

# Configuration

Create [a gist](https://gist.github.com/) with one url on each line. Here's an example: [https://gist.github.com/f43f843be58135974c80](https://gist.github.com/f43f843be58135974c80).

# Parameters

Pageflipper accepts the following parameters:

* `gist`: The gist id
* `file` (optional): The filename in your gist. We default to 'gistfile1.txt'.
* `offset` (optional): Which url on the list to start the browser at (0 based)
* `timer`: Time in seconds until we should change the page. _Warning!_ You just want to do this on one of the browser windows or you will end up with multiple timers. The client drives the flipping.