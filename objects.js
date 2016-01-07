var Helper = {

	data: function() {
		var obj = {
			"scale": "",
			"title": {},
			"events": [],
			"eras": []
		}

		return obj;
	},

	slide: function() {
		var obj = {
	        "text": {},
	        "media": {},
	        "group": "",
			"start_date": {}
		};

		return obj;
	},

	title: function(headline, text, media_url, media_caption, media_source) {
		var obj = this.slide();
		obj["text"]["headline"] = headline;
		obj["text"]["text"] = text;
		obj["media"]["url"] = media_url;
		obj["media"]["caption"] = media_caption;
		obj["media"]["credit"] = media_source;
		return obj;
	},

	/*
		Parameters:
		------------
		headline, 
		text, 
		media_url, 
		media_caption, 
		media_source, 
		group, 
		year, 
		month, 
		day, 
		hour, 
		minute, 
		second, 
		millisecond
	*/
	event: function(headline, text, media_url, media_caption, media_source, group, year, month, day, hour, minute, second, millisecond) {
		var obj = this.title(headline, text, media_url, media_caption, media_source);
		obj["group"] = group;
		obj["start_date"]["year"] 		 = year;
		obj["start_date"]["month"] 		 = month;
		obj["start_date"]["day"] 		 = day;
		obj["start_date"]["hour"] 		 = hour;
		obj["start_date"]["minute"] 	 = minute;
		obj["start_date"]["second"] 	 = second;
		obj["start_date"]["millisecond"] = millisecond;
		console.log(obj);
		return obj;
	},

	span: function(headline, text, media_url, media_caption, media_source, group, year, month, day, hour, minute, second, millisecond, eyear, emonth, eday, ehour, eminute, esecond, emillisecond) {
		var obj = this.event(headline, text, media_url, media_caption, media_source, group, 
				 year, month, day, hour, minute, second, millisecond);
		obj["end_date"] = {};
		obj["end_date"]["year"]        = eyear;
		obj["end_date"]["month"]       = emonth;
		obj["end_date"]["day"]         = eday;
		obj["end_date"]["hour"]   	   = ehour;
		obj["end_date"]["minute"]      = eminute;
		obj["end_date"]["second"]      = esecond;
		obj["end_date"]["millisecond"] = emillisecond;
		return obj;
	}
};