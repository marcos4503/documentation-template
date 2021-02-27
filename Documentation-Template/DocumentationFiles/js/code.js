//Global variables
var tablesProcesseds = 0;

//Events
window.onscroll = function () {
    FillReadProgressBar();
    ScrollSummary();
    EnableOrDisableGoToTopButton();
};
window.onload = function () {
    FillReadProgressBar();
    ScrollSummary();
    RunPostProcessOfAllToolsTags();
    AsyncCheckForEachSummaryItemVisibility();
    document.title = document.title + " Doc";
    Rainbow.color();
}
window.onresize = function () {
    FillReadProgressBar();
    ScrollSummary();
}

//Read progress code
function FillReadProgressBar() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("readProgressBar").style.width = scrolled + "%";
}

//Scroll vertically the summary div code
function ScrollSummary() {
    //Do calcs to know total page height
    var contentDiv = document.getElementById("content");
    var endOfContentPointDiv = document.getElementById("contentEndPoint");
    var topbarHeightSize = 64;

    //Find the divs and calculate the size of each
    var dividerDiv = document.getElementById("divider");
    var dividerHeight = document.body.clientHeight * 0.80;
    dividerDiv.style.height = dividerHeight + "px";
    var summaryDiv = document.getElementById("summary");
    var summaryHeight = document.body.clientHeight * 0.90;
    summaryDiv.style.height = summaryHeight + "px";

    //If is not reached in bottom of page, move the divider and summary with scroll
    if (isElementCurrentlyVisibleInScreen(endOfContentPointDiv) == false) {
        dividerDiv.style.marginTop = Math.max(0, window.pageYOffset + ((document.body.clientHeight - dividerHeight - topbarHeightSize) * 0.5)) + 'px';
        summaryDiv.style.marginTop = Math.max(0, window.pageYOffset + ((document.body.clientHeight - summaryHeight - topbarHeightSize) * 0.5)) + 'px';
    }

    //If is reached in bottom of page, put the divider and summary on max bottom
    if (isElementCurrentlyVisibleInScreen(endOfContentPointDiv) == true) {
        var dividerDiv = document.getElementById("divider");
        var summaryDiv = document.getElementById("summary");
        dividerDiv.style.marginTop = (contentDiv.offsetHeight - dividerHeight) + "px";
        summaryDiv.style.marginTop = (contentDiv.offsetHeight - summaryHeight) + "px";
    }
}

//Code to check if a div is visible and highlight item im summary
function isElementCurrentlyVisibleInScreen(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}
const DelayBetweenEachSummaryItemCheck = ms => new Promise(res => setTimeout(res, ms));
const AsyncCheckForEachSummaryItemVisibility = async () => {
    while (true) {
        var allItemsOfSummary = document.getElementsByClassName("summaryItem");
        for (var i = 0; i < allItemsOfSummary.length; i++) {
            var currentItem = allItemsOfSummary[i];
            if (currentItem == null)
                continue;
            var correspondentDivValue = currentItem.getAttribute("correspondentTopicId");
            if (correspondentDivValue == null || correspondentDivValue == "")
                continue;
            var correspondentDiv = document.getElementById(correspondentDivValue);
            if (correspondentDiv == null)
                continue;
            if (isElementCurrentlyVisibleInScreen(correspondentDiv) == true)
                currentItem.setAttribute("style", "background-color: rgba(0, 96, 138, 0.15); padding-right: 4px; padding-left: 8px; border-bottom-right-radius: 4px; border-top-right-radius: 4px;");
            else
                currentItem.setAttribute("style", "");
        }

        await DelayBetweenEachSummaryItemCheck(42);
    }
};

//Function to animate movement to a determined div
function GoToDivSmoothly(linkElement) {
    var correspondentTopicDivId = document.getElementById(linkElement.getAttribute("correspondentTopicId"));
    var correspondentDivOffset = correspondentTopicDivId.offsetTop - 80;
    if (correspondentDivOffset <= 0)
        correspondentDivOffset = 0;
    GoToDivSmoothlyCore(document.scrollingElement || document.documentElement, "scrollTop", "", window.pageYOffset, correspondentDivOffset, 250, true);
}
function GoToDivSmoothlyCore(elem, style, unit, from, to, time, prop) {
    if (!elem) {
        return;
    }
    var start = new Date().getTime(),
        timer = setInterval(function () {
            var step = Math.min(1, (new Date().getTime() - start) / time);
            if (prop) {
                elem[style] = (from + step * (to - from)) + unit;
            } else {
                elem.style[style] = (from + step * (to - from)) + unit;
            }
            if (step === 1) {
                clearInterval(timer);
            }

            ScrollSummary();
            FillReadProgressBar();
        }, 16);
    if (prop) {
        elem[style] = from + unit;
    } else {
        elem.style[style] = from + unit;
    }
}

//Function to enable or disable the goto top button
function EnableOrDisableGoToTopButton() {
    var gotoTopButton = document.getElementById("gotoTopButtonItem");
    if (window.pageYOffset >= (document.documentElement.scrollHeight * 0.05))
        gotoTopButton.style.opacity = "1";
    else
        gotoTopButton.style.opacity = "0";
}
function GoToToButton() {
    GoToDivSmoothlyCore(document.scrollingElement || document.documentElement, "scrollTop", "", window.pageYOffset, 0, 250, true);
}

//Function to show popup with image in full screen
function OpenImageInFullScreen(src) {
    //Get all components
    var fullScreenViewerBg = document.getElementById("fullScreenImageViewerBg");
    var fullScreenViewerPop = document.getElementById("fullScreenImageViewerPop");
    var fullScreenViewerImg = document.getElementById("fullScreenImageViewerImg");
    var fullScreenViewerClose = document.getElementById("fullScreenImageClose");

    //Open window
    fullScreenViewerBg.style.opacity = "0.8";
    fullScreenViewerBg.style.pointerEvents = "all";
    fullScreenViewerPop.style.opacity = "1.0";
    fullScreenViewerImg.style.pointerEvents = "all";
    fullScreenViewerImg.setAttribute("src", src);
    fullScreenViewerClose.style.pointerEvents = "all";

    document.body.style.overflow = "hidden";
}
function CloseImageFullScreenViewer() {
    //Get all components
    var fullScreenViewerBg = document.getElementById("fullScreenImageViewerBg");
    var fullScreenViewerPop = document.getElementById("fullScreenImageViewerPop");
    var fullScreenViewerImg = document.getElementById("fullScreenImageViewerImg");
    var fullScreenViewerClose = document.getElementById("fullScreenImageClose");

    //Close window
    fullScreenViewerBg.style.opacity = "0.0";
    fullScreenViewerBg.style.pointerEvents = "none";
    fullScreenViewerPop.style.opacity = "0.0";
    fullScreenViewerImg.style.pointerEvents = "none";
    fullScreenViewerClose.style.pointerEvents = "none";

    document.body.style.overflow = "auto";
}

//Function that post process all tools tags
function RenameNode(node, newNodeName) {
    const newNode = node.ownerDocument.createElement(newNodeName);
    Array.from(node.attributes).forEach(attr => newNode.setAttribute(attr.localName, attr.value));
    Array.from(node.childNodes).forEach(childNode => newNode.appendChild(childNode));

    node.parentElement.insertBefore(newNode, node);
    node.parentElement.removeChild(node);

    return newNode;
}
function RunPostProcessOfAllToolsTags() {
    var temporaryTags;

    //all summary items
    temporaryTags = document.getElementsByClassName("summaryItem");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        currentItem.setAttribute("href", "topic-id:" + currentItem.getAttribute("correspondentTopicId"));
    }

    //topic
    temporaryTags = document.getElementsByTagName("doc.topic");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<div id=\"" + currentItem.getAttribute("topicid") + "\">" + content + "</div>";
    }

    //topictitle
    temporaryTags = document.getElementsByTagName("doc.topictitle");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<div class=\"toolTagTopicTitle\">" + content + "</div>";
    }

    //topicsubtitle
    temporaryTags = document.getElementsByTagName("doc.topicsubtitle");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<div class=\"toolTagTopicSubtitle\">" + content + "</div>";
    }

    //warn
    temporaryTags = document.getElementsByTagName("doc.warn");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<div class=\"toolTagWarnContainer\"><div class=\"toolTagWarnSubcontainer\"><div class=\"toolTagWarnIcon\"><img src=\"DocumentationFiles/tools/warn.png\"/></div><div class=\"toolTagWarnContent\"><div class=\"toolTagWarnText\">" + content + "</div></div></div></div>";
    }

    //info
    temporaryTags = document.getElementsByTagName("doc.info");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<div class=\"toolTagInfoContainer\"><div class=\"toolTagInfoSubcontainer\"><div class=\"toolTagInfoIcon\"><img src=\"DocumentationFiles/tools/info.png\"/></div><div class=\"toolTagInfoContent\"><div class=\"toolTagInfoText\">" + content + "</div></div></div></div>";
    }

    //achiev
    temporaryTags = document.getElementsByTagName("doc.achiev");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<div class=\"toolTagAchievContainer\"><div class=\"toolTagAchievSubcontainer\"><div class=\"toolTagAchievIcon\"><img src=\"DocumentationFiles/tools/achiev.png\"/></div><div class=\"toolTagAchievContent\"><div class=\"toolTagAchievText\">" + content + "</div></div></div></div>";
    }

    //detach
    temporaryTags = document.getElementsByTagName("doc.detach");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<div class=\"toolTagDetach\">" + content + "</div>";
    }

    //image
    temporaryTags = document.getElementsByTagName("doc.image");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<div class=\"toolTagImageContainer\"><div class=\"toolTagImageImg\"><img src=\"" + currentItem.getAttribute("src") + "\" title=\"Click here to see in Fullscreen.\"  onmouseout=\"this.style.opacity = '1';\" onmouseover=\"this.style.opacity = '0.8';\" onclick=\"OpenImageInFullScreen('" + currentItem.getAttribute("src") + "');\" /></div><div class=\"toolTagImageComment\">" + ((content == "") ? "Representation" : content) + "</div></div>";
    }

    //video
    temporaryTags = document.getElementsByTagName("doc.video");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<div class=\"toolTagVideoContainer\"><div class=\"toolTagVideoVideo\"><video controls><source src=\"" + currentItem.getAttribute("src") + "\" type=\"video/mp4\">The video could not be displayed in your browser.</video></div><div class=\"toolTagVideoComment\">" + content + "</div></div>";
    }

    //code
    temporaryTags = document.getElementsByTagName("doc.code");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var codeContent = currentItem.firstElementChild.innerHTML;
        if (currentItem.getAttribute("language") != "html" && currentItem.getAttribute("language") != "php" && currentItem.getAttribute("language") != "javascript")
            codeContent = codeContent.replace(/<\/.+?>/g, "");  //<-- remove all closing tags (if the language type is not html, php or javascript)
        codeContent = codeContent.replace(/>/g, "&gt;");    //<-- replace all > by &gt;
        codeContent = codeContent.replace(/</g, "&lt;");    //<-- replace all < by &lt;
        if (codeContent.charAt(0) == "\n")
            codeContent = codeContent.replace("\n", "");    //<-- remove first line break (if the first character is line break)
        currentItem.firstElementChild.innerHTML = codeContent;
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<div class=\"toolTagCodeContainer\"><div class=\"toolTagCodeComment\">Script Code</div><pre class=\"toolTagCodeContent\"><center class=\"toolTagCodeTitle\">" + currentItem.getAttribute("language").toUpperCase().replace("CSHARP", "C#") + "</center>" + content.replace("<code>", "<code data-language=\"" + currentItem.getAttribute("language") + "\">") + "</pre></div>";
    }

    //tablec
    temporaryTags = [0, 0];
    while (temporaryTags.length > 0) {
        temporaryTags = document.getElementsByTagName("doc.tablec"); //<- update list of all this tags
        var currentItem = temporaryTags[0];
        currentItem = RenameNode(currentItem, "tr");
        var content = currentItem.innerHTML;
        var contentSplitted = content.split(/=&gt;/); //=>
        currentItem.innerHTML = "";
        for (var x = 0; x < contentSplitted.length; x++)
            if (contentSplitted[x] != "")
                if (contentSplitted[x].match(/\d+/g) || contentSplitted[x].match(/[a-zA-Z]/g))
                    currentItem.innerHTML += "<th>" + contentSplitted[x] + "</th>";
    }

    //tabler
    temporaryTags = [0, 0];
    while (temporaryTags.length > 0) {
        temporaryTags = document.getElementsByTagName("doc.tabler"); //<- update list of all this tags
        var currentItem = temporaryTags[0];
        currentItem = RenameNode(currentItem, "tr");
        var content = currentItem.innerHTML;
        var contentSplitted = content.split(/=&gt;/); //=>
        currentItem.innerHTML = "";
        for (var x = 0; x < contentSplitted.length; x++)
            if (contentSplitted[x] != "")
                if (contentSplitted[x].match(/\d+/g) || contentSplitted[x].match(/[a-zA-Z]/g))
                    currentItem.innerHTML += "<td>" + contentSplitted[x] + "</td>";
    }

    //table
    temporaryTags = [0, 0];
    while (temporaryTags.length > 0) {
        temporaryTags = document.getElementsByTagName("doc.table"); //<- update list of all this tags
        var currentItem = temporaryTags[0];
        currentItem = RenameNode(currentItem, "table");
        currentItem.setAttribute("doc.table", "");
    }

    //tablecw
    temporaryTags = [0, 0];
    while (temporaryTags.length > 0) {
        temporaryTags = document.getElementsByTagName("doc.tablecw"); //<- update list of all this tags
        var currentItem = temporaryTags[0];
        var content = currentItem.innerHTML;
        var parentElement = currentItem.parentElement;
        currentItem.parentElement.removeChild(currentItem);
        var parentContent = parentElement.innerHTML;
        var widths = content.split(/=&gt;/);
        parentElement.setAttribute("class", "");
        parentElement.classList.add("toolTagTable");
        parentElement.classList.add("table" + tablesProcesseds);
        parentElement.innerHTML = "";
        for (var x = 0; x < widths.length; x++)
            parentElement.innerHTML += "<style>.table" + tablesProcesseds + " th:nth-child(" + (x + 1) + "){ width: " + widths[x] + "; }</style>";
        parentElement.innerHTML += parentContent;
        tablesProcesseds += 1;
    }

    //list
    temporaryTags = document.getElementsByTagName("doc.list");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<ul class=\"toolTagList\" style=\"list-style-type: " + ((currentItem.getAttribute("isnumeric") == "true") ? "decimal" : "disc") + ";\">" + content + "</ul>";
    }

    //listr
    temporaryTags = document.getElementsByTagName("doc.listr");
    for (var i = 0; i < temporaryTags.length; i++) {
        var currentItem = temporaryTags[i];
        var content = currentItem.innerHTML;
        currentItem.innerHTML = "<li>" + content + "</li>";
    }
}