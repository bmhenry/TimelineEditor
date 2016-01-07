var data = Helper.data();
data["scale"] = "human";

var description_string = "<p>Hello! This is the Timeline Editor, which is a wrapper interface for <a target='blank' href='https://timeline.knightlab.com/'>TimelineJS</a>." + 
						"Use the menus in the upper-left corner of this site to save, load, and edit your timeline. Check out the '?' Help menu for more information.</p>" + 
						"<p><b><i>Important!</i></b> Refreshing this page will erase your timeline! Save before refreshing!</p>" +
						"<br>" + 
						"<p><i>Hint:</i> If you use the 'Edit > Edit Timeline Info' menu, you can modify this Title slide.</p>";

data["title"] = Helper.title("Timeline Title", description_string, "http://images.freeimages.com/images/previews/c0b/pineapple-1328495.jpg", "A Pineapple", "freeimages.com");
data["events"].push(Helper.event("Example Event", "<p>Put your event description here. Check out the '?' Help section in the upper left for more information." + 
									"You can delete or edit this event from the 'Edit > Edit Events' Menu.</p>" + 
									"<br>" + 
									"<p>If you know HTML, you can use it to add <i><span style='color:green;'>style</span></i> to the text in your slides.</p>", 
									"https://www.youtube.com/watch?v=cKhVupvyhKk", "What is coding?", "Microsoft Learning", "Example Group", "0", "1", "1", "", "", "", "", ""));
/*
data["events"].push(Helper.span("Example Event", "Put your event description here", "https://www.youtube.com/watch?v=cKhVupvyhKk", "What is coding?", "Microsoft Learning", "", "-1", "1", "1", "", "", "", "", "1", "1", "1", "", "", "", ""));
*/

var inmenu = false;

var timeline = new TL.Timeline("timeline", data);

// overlays
var overlay = document.getElementById("mainoverlay");
var filemenu = document.getElementById("filediv");
var editmenu = document.getElementById("editdiv");
var timelinemenu = document.getElementById("edittimelinemenu");
var eventsmenu = document.getElementById("editeventsmenu");
var help = document.getElementById("help");

// timeline info inputs
var ttitle = document.getElementById("ttitle");
var tdesc = document.getElementById("tdesc");
var tmedia = document.getElementById("tmedia");
var tcaption = document.getElementById("tcaption");
var tsource = document.getElementById("tsource");

// event info inputs
var eventselect = document.getElementById("eventselect");
var etitle = document.getElementById("etitle");
var edesc = document.getElementById("edesc");
var egroup = document.getElementById("egroup");
var emedia = document.getElementById("emedia");
var ecaption = document.getElementById("ecaption");
var esource = document.getElementById("esource");
var start_period = document.getElementById("start_period");
var start_year = document.getElementById("start_year");
var start_month = document.getElementById("start_month");
var start_day = document.getElementById("start_day");
var end_period = document.getElementById("end_period");
var end_year = document.getElementById("end_year");
var end_month = document.getElementById("end_month");
var end_day = document.getElementById("end_day");


// end date stuff
var use_end_date = document.getElementById("use_end_date");
var enddate_label = document.getElementById("enddate_label");
var enddate_row = document.getElementById("enddate_row");



function newTimeline() {
	window.location.reload();
}

function replacer(key, value) {
	// get just the date info from the 'Date' class created by
	//  the timeline
	if (key == "start_date" || key == "end_date") {
		return value["data"];
	}

	return value;
}

function saveTimeline() {
	var link = document.getElementById("savelink");

	var str_data = JSON.stringify(data, replacer);

	var file = new Blob([str_data], {type: 'text/plain'});
	link.href = URL.createObjectURL(file);
	link.download = "my_timeline.txt";

	document.getElementById("savesection").style.display = "initial";
}

function hideSaveLink() {
	document.getElementById("savesection").style.display = "none";
}

function showLoadSection() {
	document.getElementById("loadsection").style.display = "initial";
}

function addEventOption(text, value) {
	var option = document.createElement("option");
	option.value = value;
	option.text = text;
	eventselect.add(option, eventselect.options.length);
}

function listEvents(element) {
	addEventOption(element["text"]["headline"], element["unique_id"]);
}

function updateEventList() {
	// clear the selection menu
	while (eventselect.length > 0) {
		eventselect.options.remove(0);
	}

	var option = document.createElement("option");
	addEventOption("New Event", "new_event");
	addEventOption("----------------------------------", "spacer");

	data["events"].forEach(listEvents);
}

function eventListChanged() {
	var val = eventselect.value;

	if (val == "new_event") {
		clearEventInfo();
	} else if (val == "spacer") {
		eventselect.value = "new_event";
		clearEventInfo();
	} else {
		var current_event = timeline.getDataById(val);
		console.log(current_event);

		etitle.value = current_event["text"]["headline"];
		edesc.value = current_event["text"]["text"];
		egroup.value = current_event["group"];
		emedia.value = current_event["media"]["url"];
		ecaption.value = current_event["media"]["caption"];
		esource.value = current_event["media"]["credit"];

		var year = Number(current_event["start_date"]["data"]["year"]);

		if (year < 0) {
			start_period.value = "year_bce";
			start_year.value = -year.toString();
		} else {
			start_period.value = "year_ce";
			start_year.value = year;
		}

		start_month.value = current_event["start_date"]["data"]["month"];
		start_day.value = current_event["start_date"]["data"]["day"];

		if (current_event["end_date"]) {
			use_end_date.checked = true;

			year = Number(current_event["end_date"]["data"]["year"]);

			if (year < 0) {
				end_period.value = "year_bce";
				end_year.value = -year.toString();
			} else {
				end_period.value = "year_ce";
				end_year.value = year;
			}

			end_month.value = current_event["end_date"]["data"]["month"];
			end_day.value = current_event["end_date"]["data"]["day"];
		} else {
			use_end_date.checked = false;

			end_period.value = "year_ce";
			end_year.value = "";
			end_month.value = "";
			end_day.value = "";
		}
	}
}

function loadTimeline() {
	var fileselect = document.getElementById("fileselect");
	if (!fileselect.files[0]) {
		alert("You need to select a file to load.");
		return;
	}

	var file = fileselect.files[0];
	var reader = new FileReader();

	reader.onload = function(e) {
        data = JSON.parse(e.target.result);
		updateTimeline();
	};

	reader.readAsText(file);

	document.getElementById("loadsection").style.display = "none";
}

function updateTimeline() {
	timeline = new TL.Timeline("timeline", data);
	updateEventList();
}

function saveTimelineInfo() {
	data["title"] = Helper.title(ttitle.value, tdesc.value, tmedia.value, tcaption.value, tsource.value);

	updateTimeline();
}

function getEventIndexById(event_id) {
	var ev_index = null;

	if (event_id != "new_event") {
		// modified existing event

		for (var i = data["events"].length - 1; i >= 0; i--) {
			if (data["events"][i]["unique_id"] = event_id) {
				ev_index = i;
				break;	
			}
		}
	}

	return ev_index;
}

function saveEventInfo() {
	// make a single date event or a spanning event?
	var syr;
	var eyr;
	var ev;

	if (use_end_date.checked == true) {
		// span
		if (start_period.value == "year_bce")
			syr = "-".concat("", start_year.value);
		else {
			syr = start_year.value;

		}
		if (end_period.value == "year_bce")
			eyr = "-".concat("", end_year.value);
		else
			eyr = end_year.value;

		ev = Helper.span(etitle.value, edesc.value,
							emedia.value, ecaption.value, esource.value, 
							egroup.value, 
							syr, start_month.value, start_day.value, "", "", "", "", 
							eyr, end_month.value, end_day.value, "" ,"", "", "");
	} else {
		// event
		if (start_period.value == "year_bce")
			syr = "-".concat("", start_year.value);
		else
			syr = start_year.value;

		ev = Helper.event(etitle.value, edesc.value,
							emedia.value, ecaption.value, esource.value, 
							egroup.value, 
							syr, start_month.value, start_day.value, "", "", "", "");
	}

	var ev_index = getEventIndexById(eventselect.value);

	// an error check for nonexisting event ids
	if (ev_index != null)
		data["events"][ev_index] = ev;
	else
		data["events"].push(ev); // new event

	updateTimeline();
	clearEventInfo();
}

function deleteEvent() {
	var ev_index = getEventIndexById(eventselect.value);

	// an error check for nonexisting event ids
	if (ev_index != null) {
		data["events"].splice(ev_index, 1);
		updateTimeline();
	}

	clearEventInfo();
}

function clearEventInfo() {
	etitle.value = "";
	edesc.value = "";
	egroup.value = "";
	emedia.value = "";
	ecaption.value = "";
	esource.value = "";
	start_period.value = "year_ce";
	start_year.value = "";
	start_month.value = "";
	start_day.value = "";
	end_period.value = "year_ce";
	end_year.value = "";
	end_month.value = "";
	end_day.value = "";
}

function checkEndDate() {
	if (use_end_date.checked) {
		enddate_label.style.display = "initial";
		enddate_row.style.display = "initial";
	}
	else {
		enddate_label.style.display = "none";
		enddate_row.style.display = "none";
	}
}

function clearTimelineInfo() {
	ttitle.value = "";
	tdesc.value = "";
	tmedia.value = "";
	tcaption.value = "";
	tsource.value = "";
}

function overmenu() {
	inmenu = true;
}

function leftmenu() {
	inmenu = false;
}

function showOverlay() {
	overlay.style.display = "initial";
}

function checkHideOverlay() {
	if (!inmenu)
		hideOverlay();
}

function hideOverlay() {
	overlay.style.display = "none";
	filemenu.style.display = "none";
	editmenu.style.display = "none";
	timelinemenu.style.display = "none";
	eventsmenu.style.display = "none";
	help.style.display = "none";

	clearEventInfo();
	clearTimelineInfo();
}

function openFileControls() {
	showOverlay();
	filemenu.style.display = "initial";
}

function openEditControls() {
	showOverlay();
	editmenu.style.display = "initial";
}

function openHelp() {
	showOverlay();
	help.style.display = "initial";
}

function openTimelineControls() {
	timelinemenu.style.display = "initial";
	eventsmenu.style.display = "none";

	updateTimelineInfoDisplay();
}

function updateTimelineInfoDisplay() {
	// load in whatever the current title slide information is
	ttitle.value = data["title"]["text"]["headline"];
	tdesc.value = data["title"]["text"]["text"];
	tmedia.value = data["title"]["media"]["url"];
	tcaption.value = data["title"]["media"]["caption"];
	tsource.value = data["title"]["media"]["credit"];
}

function openEventsControls() {
	timelinemenu.style.display = "none";
	eventsmenu.style.display = "initial";
	updateEventList();
}

overlay.addEventListener("click", checkHideOverlay);