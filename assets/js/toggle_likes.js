// // CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
// class ToggleLike{
//     constructor(toggleElement){
//         this.toggler = toggleElement;
//         this.toggleLike();
//     }


//     toggleLike(){
//         $(this.toggler).click(function(e){
//             e.preventDefault();
//             let self = this;

//             // this is a new way of writing ajax which you might've studied, it looks like the same as promises
//             $.ajax({
//                 type: 'POST',
//                 url: $(self).attr('href'),
//             })
//             .done(function(data) {
//                 let likesCount = parseInt($(self).attr('data-likes'));
//                 console.log(likesCount);
//                 if (data.data.deleted == true){
//                     likesCount -= 1;
                    
//                 }else{
//                     likesCount += 1;
//                 }


//                 $(self).attr('data-likes', likesCount);
//                 $(self).html(`${likesCount} Likes`);

//             })
//             .fail(function(errData) {
//                 console.log('error in completing the request',errData);
//             });
            

//         });
//     }
// }

class ToggleLike {
    constructor(toggleElement) {
      this.toggler = toggleElement;
      this.toggleLike();
    }
  
    toggleLike() {
      const self = this;
  
      $(document).on("click", this.toggler, function (e) {
        e.preventDefault();
        const toggleElement = $(this);
  
        // Get the URL from the href attribute
        const url = toggleElement.attr("href");
  
        // Make the AJAX request
        $.ajax({
          type: "POST",
          url: url,
        })
          .done(function (data) {
            let likesCount = parseInt(toggleElement.attr("data-likes"));
            console.log(likesCount);
            if (data.data.deleted == true) {
              likesCount -= 1;
            } else {
              likesCount += 1;
            }
  
            // Update the data-likes attribute and the displayed likes count
            toggleElement.attr("data-likes", likesCount);
            toggleElement.html(`${likesCount} Likes`);
          })
          .fail(function (errData) {
            console.log("error in completing the request", errData);
          });
      });
    }
  }
  