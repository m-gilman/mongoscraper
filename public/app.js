//KNOWN BUGS:
// After user adds 1 or more notes to a job, notes cannot be added to additional jobs - they stay associated with the first job (I think)
// -> Related to the above bug, clicking delete on an empty note in the first saved notes job, deletes a different note 
//Additional features to add:
// * Clear all jobs option (on home and saved page)
// * Delete specific jobs option
// * Allow user to choose a different job type and location to query a different URL... 
// Add a "Notable Jobs" tab that shows all jobs with notes on them
// Add a badge icon on the notes button for saved jobs with notes (like the red number on a phone)


$(document).ready(function () {

  // *****DO NOT use ES6! (not using a transpiler)
  // DO NOT use arrow functions here!!!!!!******

  //Add border to navbar when clicked
  $(".navbar-nav li").click(function () {
    $(".navbar-nav li").removeClass("border");
    $(this).addClass("border");
  });

  // Handle "Search for Jobs" button
  $("#scrape-new").click(function () {

    // // ***** A PROJECT FOR ANOTHER DAY... CHANGE THE SEARCH TERMS*****
    // job type search and location to be passed to the URL
    // var jobType = $("#jobType").val().trim();
    // var location = $("#location").val().trim();
    // jobType = encodeURIComponent(jobType);
    // location = encodeURIComponent(location);
    // console.log(jobType + " & " + location);
    // var scrapeURL = "https://www.indeed.com/jobs?q=" + jobType + "&l=" + location;
    // console.log(scrapeURL)
    // // How do I get this scrape URL to my get("/scrape") route ??
    // //******************************************/

    $.ajax({
      url: '/scrape/',
      type: 'GET'
    }).then(function () {
      window.location = '/';
      // }).done(function () {

      // Modal works, but causes problems
      // $('#scrapeModal').modal('show');
      // });
    });
  });


  //Handle Save Job button
  $(".save").on("click", function () {
    var thisId = $(this).attr("id");
    console.log('id =' + thisId);

    $.ajax({
      method: "POST",
      url: "/jobs/save/" + thisId
    }).done(function (data) {
      // window.location = "/jobs/" + thisId
      window.location = '/'
    })
  });

  //Handle Delete Job button
  $(".delete").on("click", function () {
    var thisId = $(this).attr("id");
    // alert("Delete #: " + thisId)

    $.ajax({
      method: "POST",
      url: "/jobs/delete/" + thisId
    }).done(function (data) {
      // window.location = "/jobs/" + thisId
      window.location = '/saved';
    })
  });


  // ------- NOTES -------
  // *****Reminder: No ES6! (not using a transpiler)
  // DO NOT use arrow functions here!!!*****

  // Variables for Notes section 
  var jobId = $(".saveNote").attr("id");
  var title = $(".titleInput");
  var text = $(".textInput");

  // Function to empty the notes fields
  function emptyNotes() {
    title.val("");
    text.val("");
  }


  // Handle Notes button (ACCESS NOTES SECTION, not the save a completed note button)

  $(".notes").on("click", function () {
    // --Unnecessary-- Might delete
    // Empty fields (if note was started and not saved)
    console.log('jobId =' + jobId);
    // emptyNotes();
  });

  //Handle Save Note button (inside Notes modal)
  $(".saveNote").on("click", function () {
    var jobId = $(".saveNote").attr("id");
    var titleId = $("#noteTitle" + jobId);
    var textId = $("#noteText" + jobId);

    var title = titleId.val().trim();
    var text = textId.val().trim();

    var theNote = {
      title: title,
      text: text
    }
    console.log(theNote);

    // My conditional statements are causing problems. Debug later.
    // Run if there is both a title and text 
    // if (title && text) {

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/jobs/" + jobId,
      data: theNote
    })
      // With that done
      .then(function (data) {
        // Log the response
        // console.log(note);
        // Empty the notes section        *****************empty notes ??
        // emptyNotes();
        window.location = '/saved';
      });
    // } else if (title == "") {
    //   alert("Your Note needs a Title")
    // } else if (text == "") {
    //   alert("Your Note needs a Body")
    // }
  });


  //Handle Delete Note button
  $(".deleteNote").on("click", function () {
    jobId = $(".saveNote").attr("id");
    console.log("job id " + jobId)
    var noteId = $(".deleteNote").attr("data-note-id");
    console.log("note id " + noteId)

    $.ajax({
      method: "DELETE",
      url: "/notes/delete/" + noteId + "/" + jobId
    }).done(function (data) {
      console.log(data)
      $(".modalNote").modal("hide");
      window.location = "/saved"
    })
  });


});