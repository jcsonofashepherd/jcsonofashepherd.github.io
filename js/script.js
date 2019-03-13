function loadJSON(cb){
  const req = new XMLHttpRequest();
  req.open('GET', './assets/data.json', true);
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200)
      cb(JSON.parse(req.responseText));
  }
  req.send(null);
}

loadJSON(function(data) {
  /**
    *   Global variables pertaining to browser window, page structure, and page attributes
    */
  let certificates = data.certificates,
      projects = data.projects,
      pgWidth,
      pgHeight,
      wWidth,
      wHeight,
      bodyPadding,
      relBaseUnit = 900,
      pgUnit,
      homeArrCount = 4,
      aboutArrCount = 3,
      arrTransTime = 225,
      pgTransTime = 600
      projTransTime = 450,
      certTransTime = 300,
      isThumb = false;

  /**
    *   Attaches project information to project image thumbnails
    */
  function setThumbs() {
    for (let i = 0; i < 12; i++) {
      $(".project-section.left").append(
      '<div class="project-thumbnail-container">' +
        '<img draggable="false" (dragstart)="false;" class="project-thumbnail unselectable" />' +
      '</div>');
    }

    $(".project-thumbnail-container").css({opacity: 0});

    $(".project-thumbnail").each(function(idx) {
      $(this)
      .data("index", idx)
      .attr({src: projects[idx].thumb});
    });
  }

  /**
    *   Shows image thumbnails if thumbnails are not already visible
    */
  const showThumbs = _ => {
  //showInfo(projects[0]);

    $(".active-project .project-image-container").addClass("hover-blackout");

    setBlackoutHover();

    $(".project-thumbnail-container").each(function(idx) {
      setTimeout(_ => {
        $(this).animate({
          opacity: 1
        }, pgTransTime * 2 / 12);
      }, pgTransTime * idx * 2 / 12);
    });

    isThumb = true;
  }

  /**
    *   Sets hidden text onto all project slides
    */
  function setProjectInfo() {
    for (let i = 0; i < 12; i++) {
      let info = projects[i],
          descRepo,
          firstProject;

      firstProject = (i == 0) ? "active-project" : "";

      descRepo = (info.repo == "") ? "" :
        '<div class="project-repo"><a href="' + info.repo + '" target="_blank"></a></div>';

      $("#project-display").append(
        '<div class="project-information ' + firstProject +'" data-index="' + i + '">' +
          '<div class="project-header-container">' +
            '<div class="project-header">' + info.type +'</div>' +
          '</div>' +

          '<div class="project-image-container">' +
            '<a href="' + info.website + '" target="_blank">' +
              '<img class="project-image" src="' + info.img + '" />' +
            '</a>' +
          '</div>' +

          '<div class="project-description-container">' +
            '<div class="project-description">' +
              '<div class="project-name">' + info.name +'</div>' +

              '<div class="project-tools">' + info.tools +'</div>' +

              '<div class="project-site">' +
                '<a href="' + info.website + '" target="_blank"></a>' +
              '</div>' +

              descRepo +
              '<br>' +

              '<div class="project-desc">' + info.desc + '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }
  }

  /**
    *   Types project information onto the project slide
    */
  /*
  function animateInfo(el, arr) {
    for (let i = 0; i < arr.length; i++) {
      $(".active-project " + el).append('<span style="opacity: 0">' + arr[i] + '</span>');
    }

    $(".active-project " + el + " span").each(function(idx) {
      setTimeout(_ => {
        $(this).animate({opacity: 1}, 0);
      }, idx * projTransTime / arr.length);
    });
  }
    */

  /**
    *   Appends project information onto the project slide
    */
  /*
  function showInfo(info) {
    let typeArr = info.type.split(""),
        nameArr = info.name.split(""),
        toolsArr = info.tools.split(""),
        descArr = info.desc.split("");

    animateInfo(".project-header", typeArr);
    animateInfo(".project-name", nameArr);
    animateInfo(".project-tools", toolsArr);
    animateInfo(".project-site a", "WEBSITE".split(""));
    animateInfo(".project-repo a", "REPOSITORY".split(""));
    animateInfo(".project-desc", descArr);
  }
    */

  /**
    *   Removes project information from the project slide fading out
    */
  function deleteInfo(el) {
    let len = $(".active-project " + el + " span").length;

    $($(".active-project " + el + " span")
    .get()
    .reverse())
    .each(function(idx) {
      setTimeout(_ => {
        $(this).remove();
      }, idx * projTransTime / len);
    });
  }

  /**
    *   Binds hover event listeners to navigation bar elements and home page icons
    */
  function setHovers() {
    $(".nav-title").hover(_ => {
      $(".nav-bar").css({backgroundColor: "#212529"});
      $(".nav-btn").css({opacity: "0"});
    }, _ => {
      $(".nav-bar").css({backgroundColor: "#fcfcfc"});
      $(".nav-btn").css({opacity: "1"});
    });

    $(".home-lang .home-tools").hover(_ => {
      $(".home-lang i").addClass("hover");
    }, _ => {
      $(".home-lang i").removeClass("hover");
    });

    $(".home-tech .home-tools").hover(_ => {
      $(".home-tech i").addClass("hover");
    }, _ => {
      $(".home-tech i").removeClass("hover");
    });
  }

  /**
    *   Binds a hover event listener to the image container so that the right page section fades
    *     to black
    */
  function setBlackoutHover() {
    $(".hover-blackout").off();

    $(".hover-blackout").hover(_ => {
      $(".active-project").css({backgroundColor: "#212529"});
      $(".project-information *").css({textShadow: "none"});
    }, _ => {
      $(".active-project").css({backgroundColor: "#fcfcfc"});
      $(".project-information *").css({textShadow: "2px 2px 3px rgba(0, 0, 0, 0.3)"});
    });
  }

  /**
    *   Binds a hover event listener to certification listings to expand descriptions
    */
  function setCertificateHover() {
    $(".about-certificate a").off();

    $(".about-popup-container").each(function(idx) {
      let container = $(this),
          height = $( $( $(this)[0] ).children()[0] ).height();

      container.css({
        width: 0,
        height: pgUnit * 22.5
      });

      $($(".about-certificate a")[idx]).hover(_ => {
        if (!container.hasClass("transitioning")) {
          container
          .stop()
          .addClass("transitioning")
          .css({
            width: 0,
            height: pgUnit * 22.5
          })
          .animate({width: pgWidth / 2.5}, certTransTime, _ => {
            container.animate({
              width: pgWidth / 2.5,
              height: height
            }, certTransTime, function() {
              $(this).css({
                width: pgWidth / 2.5,
                height: height
              });
            });
          });
        }
      }, _ => {
        container.animate({height: pgUnit * 22.5}, certTransTime * 2 / 5, _ => {
          container.animate({
            width: 0,
            height: pgUnit * 22.5
          }, certTransTime * 2 / 5, function() {
            $(this).removeClass("transitioning");
          });
        });
      });
    });
  }

  /**
    *   Animates navigation button presses
    */
  function animateBtns(pg) {
    $(".pressed")
    .removeClass("pressed")
    .queue(function() {
      $("." + pg.toLowerCase() + "-btn").addClass("pressed");

      $(this).dequeue();
    });
  }

  /**
    *   Appends arrows to pages
    */
  function appendArrs(pageEl, arrCount, arrType) {
    for (let i = 0; i < arrCount; i++) {
      $(pageEl).append("<span>" + arrType + "</span>");
    }
  }

  /**
    *   Sets the interval of the arrow indicators in the home page
    */
  function animateHomeArr(arrowIdx) {
    let prevIdx,
        arrowFadeOutTime = arrTransTime * homeArrCount;

    arrowIdx = (arrowIdx == homeArrCount + 1) ? 1 : arrowIdx;
    prevIdx = (arrowIdx == 1) ? homeArrCount : arrowIdx - 1;

    $(".home-next span:nth-of-type(" + prevIdx + ")").fadeTo(arrowFadeOutTime, 1);
    $(".home-next span:nth-of-type(" + arrowIdx +")").fadeTo(arrTransTime, 0, _ => {
      arrowIdx++;

      animateHomeArr(arrowIdx);
    });
  }

  /**
    *   Sets the interval of the arrow indicators in the about page
    */
  function animateAboutArr(ltIdx, rtIdx) {
    let prevLtIdx,
        prevRtIdx,
        arrowFadeOutTime = arrTransTime * aboutArrCount;

    ltIdx = (ltIdx == 0) ? aboutArrCount : ltIdx;
    prevLtIdx = (ltIdx == aboutArrCount) ? 1 : ltIdx + 1;
    rtIdx = (rtIdx == aboutArrCount + 1) ? 1 : rtIdx;
    prevRtIdx = (rtIdx == 1) ? aboutArrCount : rtIdx - 1;

    $(".about-prev span:nth-of-type(" + prevLtIdx + ")").fadeTo(arrowFadeOutTime, 1);
    $(".about-prev span:nth-of-type(" + ltIdx + ")").fadeTo(arrTransTime, 0);
    $(".about-next span:nth-of-type(" + prevRtIdx + ")").fadeTo(arrowFadeOutTime, 1);
    $(".about-next span:nth-of-type(" + rtIdx + ")").fadeTo(arrTransTime, 0, () => {
      ltIdx--;
      rtIdx++;

      animateAboutArr(ltIdx, rtIdx);
    });
  }

  /**
    *   Appends arrows to pages
    */
  function setArrs() {
    appendArrs(".home-next", homeArrCount, "&rsaquo;");

    animateHomeArr(1);

    appendArrs(".about-next", aboutArrCount, "&rsaquo;");
    appendArrs(".about-prev", aboutArrCount, "&lsaquo;");

    animateAboutArr(aboutArrCount, 1);
  }

  /**
    *   Sets certificate information to the about page
    */
  function setCertificates() {
    $(".about-certificate").each(idx => {
      let name = certificates[idx]["name"],
          content = certificates[idx]["content"];

      $($(".about-certificate-name")[idx]).append(name);
      $($(".about-certificate-content")[idx]).append(content);
    });
  }

  /**
    *   Updates global variables as a result of window dimensions
    */
  function updateDims() {
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;

    if (wHeight <= 506) {
      pgWidth = 800;
      pgHeight = 450;
    }
    else {
      pgWidth = (wHeight - 56) * 16 / 9;
      pgHeight = wHeight - 56.4;
    }

    bodyPadding = (pgWidth >= wWidth) ? 0 : (wWidth - pgWidth) / 2;
    pgUnit = pgWidth / relBaseUnit;
  }

  /**
    *   Sets the basis of page elements
    */
  function setBase() {
    $("body").css({
      left: bodyPadding,
      width: pgWidth,
      height: pgHeight
    });

    $(".page-frame, .page-container, .project-bound").css({
      width: pgWidth,
      height: pgHeight,
    });

    $(".project-bound .page-frame").css({
      left: -pgWidth / 5,
      width: "150%"
    });

    $(".project-bound .page-container").css({
      left: pgWidth / 5
    });
  }

  /**
    *   Sets home page elements
    */
  function setHome() {
    $(".home-name").css({
      padding: pgUnit * 20 + "px 0 " + pgUnit * 20 + "px " + pgUnit * 20 + "px",
      fontSize: pgUnit * 130
    });

    $(".home-bio").css({
      fontSize: pgUnit * 12
    });

    $(".home-bio-text div:first-child").css({
      fontSize: pgUnit * 100
    })

    $(".home-side-right").css({
      padding: pgUnit * 17.5 + "px 0",
      paddingRight: pgUnit * 17.5
    });

    $(".home-header-top").css({
      marginTop: pgUnit * 5,
      fontSize: pgUnit * 70
    });

    $(".home-header-bottom").css({
      marginTop: pgUnit * 5,
      fontSize: pgUnit * 70
    });

    $(".home-resume").css({
      marginTop: pgUnit * 5,
      fontSize: pgUnit * 60
    });

    $(".home-subheader").css({
      paddingLeft: pgUnit * 20,
      marginBottom: pgUnit * 10,
      fontSize: pgUnit * 15
    });

    $(".home-tools i").css({
      margin: "0 " + pgUnit * 12 + "px",
      fontSize: pgUnit * 60
    });

    $(".home-next").css({
      paddingRight: pgUnit * 23,
      fontSize: pgUnit * 80
    });

    $(".home-links").css({
      padding: "0 0 " + pgUnit * 18 + "px"
    });

    $(".home-links i").css({
      margin: "0 " + pgUnit * 12.75 + "px",
      fontSize: pgUnit * 20
    });

    $(".home-links p").css({
      margin: pgUnit * 7.5 + "px " + pgUnit * 12.5 + "px",
      fontSize: pgUnit * 12
    });

    $(".signature").css({
      bottom: pgUnit * 20,
      right: pgUnit * 20,
      fontSize: pgUnit * 12
    });
  }

  /**
    *   Sets about page elements
    */
  function setAbout() {
    $("svg")
    .attr({
      width: pgWidth / 5 + 1,
      height: pgHeight
    })
    .css({
      left: pgWidth * (2 / 5) - 1
    });

    $("ul").css({
      paddingTop: pgUnit * 5,
      paddingLeft: pgUnit * 12.5
    });

    $("polygon").attr({
      points: "0," + $("svg").height() +
              " 0," +$("svg").height() / 2 +
              " " +$("svg").width() +
              ",0 " + $("svg").width() +
              "," + $("svg").height() / 2
    });

    $(".about-header").css({
      padding: pgUnit * 5 + "px " + pgUnit * 20 + "px " + pgUnit * 5 + "px",
      fontSize: pgUnit * 60
    });

    $(".about-listing").css({
      padding: pgUnit * 10 + "px " + pgUnit * 20 + "px 0",
      fontSize: pgUnit * 20
    });

    $(".about-description").css({
      padding: pgUnit * 2 + "px " + pgUnit * 35 + "px 0",
      fontSize: pgUnit * 15
    });

    $(".about-padding").css({
      height: "calc(100% - " + pgUnit * 235 + "px)"
    });

    $(".about-immediate").css({
      paddingTop: 0
    });

    $(".about-corner").css({
      paddingRight: pgUnit * 20
    });

    $(".about-next, .about-prev").css({
      padding: pgUnit * 45,
      fontSize: pgUnit * 125
    });

    $(".about-popup-container, .about-certificate-popup").css({
      width: pgWidth / 2.5
    });

    $(".about-certificate-name").css({
      margin: pgUnit * 10,
      marginBottom: 0,
      fontSize: pgUnit * 17,
      marginBottom: pgUnit * 10
    });

    $(".about-certificate-content").css({
      margin: pgUnit * 10,
      marginTop: 0,
      fontSize: pgUnit * 12
    });
  }

  /**
    *   Set projects page elements
    */
  function setProject() {
    $(".project-bound .page-container").css({
      paddingRight: pgUnit * 10,
    });

    $(".project-section.left").css({
      paddingTop: pgUnit * 10,
      paddingBottom: pgUnit * 10,
      paddingLeft: pgUnit * 10
    });

    $(".project-thumbnail-container").css({
      margin: pgUnit * 10,
      width: "calc(" + 100 / 3 + "% - " + pgUnit * 20 + "px)",
      height: "calc(25% - " + pgUnit * 20 + "px)"
    });

    $(".project-thumbnail").css({
      height: "100%"
    });

    $(".project-section.right").css({
      padding: pgUnit * 20 + "px " + pgUnit * 10 + "px"
    });

    $(".project-information").css({
      padding: pgUnit * 20,
      width: "calc(100% - " + pgUnit * 20 + "px)",
      height: "calc(100% - " + pgUnit * 40 + "px)"
    });

    $(".project-header-container").css({
      fontSize: pgUnit * 21
    });

    $(".project-image").css({
      height: "100%"
    });

    $(".project-description-container").css({
      marginTop: pgUnit * 20,
      fontSize: pgUnit * 12
    });
  }

  /**
    *   Sets pages in DOM
    */
  function setPgs() {
    setBase();
    setHome();
    setAbout();
    setProject();
  }

  /**
    *   Changes page title as page finishes transition
    */
  function setTitle(pgTitle) { $("title").html(pgTitle); }

  /**
    *   Click event function that sets upcoming page position and page animation
    */
  function pgClick(pgTrans, pgStyle) {
    animateBtns(pgTrans);

    let transitions = {
      "Home": {
        "pgFramePos": {
          display: "block",
          top: pgHeight / 2,
          left: "",
          right: pgWidth * 3 / 5,
          width: 0,
          height: pgHeight / 2
        },
        "pgContainerPos": {
          top: -pgHeight / 2,
          left: "",
          right: -pgWidth * 3 / 5,
          width: pgWidth,
          height: pgHeight
        },
        "pgFrameTransOne": {
          width: pgWidth * 2 / 5
        },
        "pgFrameTransTwo": {
          top: 0,
          right: 0,
          width: pgWidth,
          height: pgHeight
        },
        "pgContainerTrans": {
          top: 0,
          right: 0
        }
      },
      "About" : {
        "pgFramePos": {
          display: "block",
          top: pgHeight / 2,
          left: pgWidth * 3 / 5,
          width: 0,
          height: pgHeight / 5
        },
        "pgContainerPos": {
          top: -pgHeight / 2,
          left: -pgWidth * 3 / 5,
          width: pgWidth,
          height: pgHeight
        },
        "pgFrameTransOne": {
          width: pgWidth *2 / 5
        },
        "pgFrameTransTwo": {
          top: 0,
          left: 0,
          width: pgWidth,
          height: pgHeight
        },
        "pgContainerTrans": {
          top: 0,
          left: 0
        }
      },
      "Project": {
        "pgFramePos": {
          display: "block",
          left: pgWidth / 2,
          width: 0,
          height: pgHeight,
          transform: "skew(-35deg, 0)"
        },
        "pgContainerPos": {
          left: -pgWidth / 2,
          width: pgWidth,
          height: pgHeight,
          transform: "skew(35deg, 0)"
        },
        "pgFrameTransOne": null,
        "pgFrameTransTwo": {
          left: -pgWidth / 5,
          width: "150%"
        },
        "pgContainerTrans": {
          left: pgWidth / 5
        }
      },
      "Generic": {
        "pgFramePos": {
          display: "block",
          left: 0,
          right: "",
          width: 0,
          height: pgHeight,
          transform: "none"
        },
        "pgContainerPos": {
          left: 0,
          right: "",
          width: pgWidth,
          height: pgHeight,
          transform: "none"
        },
        "pgFrameTransOne": null,
        "pgFrameTransTwo": {
          left: 0,
          right: "",
          width: "100%"
        },
        "pgContainerTrans": {
          left: 0
        }
      }
    }

    if (!pgStyle)
      pgStyle = pgTrans;
    else {
      if (pgTrans == "Project") {
        transitions["Generic"]["pgFramePos"]["left"] = "";
        transitions["Generic"]["pgFramePos"]["right"] = 0;
        transitions["Generic"]["pgContainerPos"]["left"] = "";
        transitions["Generic"]["pgContainerPos"]["right"] = 0;
        transitions["Generic"]["pgFrameTransTwo"]["left"] = "";
        transitions["Generic"]["pgFrameTransTwo"]["right"] = 0;
      }
    }

    let pgFramePos = transitions[pgStyle]["pgFramePos"],
        pgContainerPos = transitions[pgStyle]["pgContainerPos"],
        pgFrameTransOne = transitions[pgStyle]["pgFrameTransOne"],
        pgFrameTransTwo = transitions[pgStyle]["pgFrameTransTwo"],
        pgContainerTrans = transitions[pgStyle]["pgContainerTrans"];

    $('<div class="transition-overlay"></div>')
    .appendTo("body")
    .css({
      left: -bodyPadding,
      width: wWidth,
      height: wHeight
    });

    $(".active")
    .addClass("inactive")
    .removeClass("active")
    .queue(function() {
      $("#" + pgTrans)
      .addClass("active in-transition")
      .removeClass("inactive");

      $(this).dequeue();
    });

    $("#" + pgTrans + " .page-container").css(pgContainerPos);

    $("#" + pgTrans)
    .css(pgFramePos)
    .animate(pgFrameTransOne, pgTransTime, _ => {
      $("#" + pgTrans).animate(pgFrameTransTwo, pgTransTime *
        ((pgTrans == "Project" || pgStyle == "Generic") ? 2 : 1)
      );

      $("#" + pgTrans + " .page-container").animate(pgContainerTrans, pgTransTime *
        ((pgTrans == "Project" || pgStyle == "Generic") ? 2 : 1), _ => {
          setTitle("Casabar - " + pgTrans);

          $(".transition-overlay").remove();

          $("#" + pgTrans).removeClass("in-transition");

          $(".inactive").css({
            display: "none"
          });

          $(".active .page-container").css({
            left: 0,
            right: ""
          });

          if (pgTrans == "Project") {
            $(".active").css({
              left: -pgWidth / 4,
              width: pgWidth * 3 / 2
            });

            $(".active .page-container").css({
              left: pgWidth / 4,
              right: 0
            });
          }
        });
    });
  }

  /**
    *   Binds click event listener to page arrows
    */
  function setArrClick() {
    $(".home-next").click(_ => {
      pgClick("About", null);
    });

    $(".about-prev").click(_ => {
      pgClick("Home", null);
    });

    $(".about-next").click(_ => {
      if (!isThumb)showThumbs();

      pgClick("Project", null);
    });
  }

  /**
    *   Click event function that builds upon the pgClick function
    */
  function navClick(pg) {
    let pgEl = $("#" + pg),
        pgHome = $("#Home"),
        pgAbout = $("#About");

    if (!pgEl.hasClass("active")) {
      if (pgAbout.hasClass("active")) {
        if (pg == "Project" && !isThumb)
          showThumbs();

        pgClick(pg, null);
      }
      else if (pgHome.hasClass("active") && pg == "About") {
        pgClick(pg, null)
      }
      else {
        if (pg == "Project" && !isThumb)
          showThumbs();

        pgClick(pg, "Generic")
      }
    }
  }

  /**
    *   Binds click event listener to navigation buttons
    */
  function setNavClick() {
    $(".nav-btn").click(function() {
      navClick($(this).data("page"));
    });
  }

  /**
    *   Click event function that animates project carousel
    */
  function projectClick(idx, currIdx) {
    let info = projects[idx],
        currProject = $(".active-project"),
        currHover = $(".active-project .project-image-container"),
        nextProject = $($(".project-information")[idx]),
        nextHover = $($(".project-information .project-image-container")[idx]),
        fadeOut,
        fadeIn,
        projectFadeOutAnimate,
        projectFadeInPos,
        projectFadeInAnimate;

    if (idx > currIdx) {
      fadeOut = -($(".project-information").width() + (pgUnit * 30));
      fadeIn = $(".project-information").width() + (pgUnit * 50);
    }
    else {
      fadeOut = $(".project-information").width() + (pgUnit * 50);
      fadeIn = -($(".project-information").width() + (pgUnit * 30));
    }

    projectFadeOutAnimate = {
      left: fadeOut,
      opacity: 0
    };

    projectFadeInPos = {
      display: "block",
      left: fadeIn,
      opacity: 0
    };

    projectFadeInAnimate = {
      left: pgUnit * 10,
      opacity: 1
    };

  /**
    deleteInfo(".project-header");
    deleteInfo(".project-name");
    deleteInfo(".project-tools");
    deleteInfo(".project-site a");
    deleteInfo(".project-repo a");
    deleteInfo(".project-desc");
    */

    currHover.removeClass("hover-blackout");
    nextHover.addClass("hover-blackout");

    setBlackoutHover();

    $("#project-display")
    .addClass("transitioning")
    .queue(function() {
      nextProject
      .addClass("active-project")
      .css(projectFadeInPos)
      .animate(projectFadeInAnimate, projTransTime);

      currProject
      .removeClass("active-project")
      .css({display: "block"})
      .animate(projectFadeOutAnimate, projTransTime, _ =>
        $("#project-display").removeClass("transitioning")
      );

  //  showInfo(info);

      $(this).dequeue();
    });
  }

  /**
    *   Binds click event listener to image thumbnails
    */
  function setProjectClick() {
    $(".project-thumbnail").click(function() {
      let idx = $(this).data("index")
          currIdx = $('.active-project').data("index");

      if (idx !== currIdx && !$("#project-display").hasClass("transitioning"))
        projectClick(idx, currIdx);
    });
  }

  /**
    *   Binds click event listener to all necessary page elements
    */
  function setClicks() {
    setArrClick();
    setNavClick();
    setProjectClick();
  }

  /**
    *   Binds keydown event listener to document for project navigation
    */
  function setArrKeydown() {
    $(document).keydown(e => {
      if ($("#Project").hasClass("active") && !$("#project-display").hasClass("transitioning")) {
        let currIdx = $('.active-project').data("index");
        if (e.keyCode == 39 && currIdx !== 11) {
          $(".active-project").css({backgroundColor: "#fcfcfc"});
          $(".project-information *").css({textShadow: "2px 2px 3px rgba(0, 0, 0, 0.3)"});

          projectClick(currIdx + 1, currIdx);
        }
        else if (e.keyCode == 37 && currIdx !== 0) {
          $(".active-project").css({backgroundColor: "#fcfcfc"});
          $(".project-information *").css({textShadow: "2px 2px 3px rgba(0, 0, 0, 0.3)"});

          projectClick(currIdx - 1, currIdx);
        }
      }
    });
  }

  /**
    *   Sets mousemove/hover event function for name bio
    */
  function setBioMouseMove() {
    $(".home-name").mousemove(e => {
      $(".home-bio").css({
        left: e.pageX - bodyPadding + 56,
        top: e.pageY - 56 * 2
      });
    });

    $(".home-name").hover(_ => {
      $(".home-bio").addClass("popup");
      $(".home-bio-text").addClass("popup-text");
    }, _ => {
      $(".home-bio").removeClass("popup");
      $(".home-bio-text").removeClass("popup-text");
    });
  }

  /**
    *   Scales window accordingly
    */
  function scaleWindow() {
    updateDims();
    setPgs();
    setCertificateHover();
  }

  /**
    *   Handles resizing of the window to update all website elements and attributes
    *   Certificate event handlers must be turned off to avoid duplicate listens
    */
  function resizeWindow() {
    $(window).resize(_ => {
      scaleWindow();
    });
  }

  /**
  *   Handles mobile orientation changes
  */
  function orientWindow() {
    $(window).on("orientationchange", _ => {
      scaleWindow();
    });
  }

  /**
    *   Calls website setup at load (home page is displayed as default)
    */
  setThumbs();
  setProjectInfo();
  setCertificates();
  updateDims();
  setPgs();
  setClicks();
  setArrKeydown();
  setHovers();
  setCertificateHover();
  setBioMouseMove();
  setArrs();
  resizeWindow();
  orientWindow();
});
