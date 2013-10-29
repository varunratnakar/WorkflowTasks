var WTUtil = function(title, api) {
	this.title = title;
	this.api = api;

	// Initialize some event handlers
	this.initEventHandlers();
};

WTUtil.prototype.initEventHandlers = function() {
	var me = this;
	$j(document).ready(function() {
	});
};

// TODO for now, assumes HTTP or HTTPS
WTUtil.prototype.getdomain = function( uri ) {
	var protlength = 0;
	if (uri.indexOf('http://')==-1) protlength = 'http://'.length-1; 
	if (uri.indexOf('https://')==-1) protlength = 'https://'.length-1;
	var domain = uri.slice(protlength);
	if (domain.indexOf('/')!=-1) domain = domain.slice(0, domain.indexOf('/'));
	var parts = domain.split('.');
	if (parts.length == 1) return domain;
	if (parts.length == 2) return parts[0];
	if ((parts[parts.length-2] == 'ac') || (parts[parts.length-2] == 'co')) return parts[parts.length-3];
	return parts[parts.length-2];
};

WTUtil.prototype.checkevent = function( chkbox, item, tr, link, linkstr, linkstrs ) {
	var num = item.data('numchecked');
	var checked_data = item.data('checked_data');
	var trdata = tr.data('data');

	if($j(chkbox).attr("checked")) {
		tr.addClass('lodselected'); num++;
		checked_data.push(trdata);
	} else {
		tr.removeClass('lodselected'); num--;
		checked_data = $j.grep(checked_data, function(v) { return v != trdata; });
	}
	if(num) {
		if(num > 1) link.html(linkstrs);
		else link.html(linkstr);
		link.removeClass('lodinvisible');
	}
	else {
		link.addClass('lodinvisible');
	}
	item.data('checked_data', checked_data);
	item.data('numchecked', num);
};

WTUtil.prototype.hideFacts = function( striples ) {
	$j.each(striples, function(i, t) {
		$j.each(t.sources, function(m, s) {
			var ident = $j('.lodentity[title="' + s + '"]');
			var table = ident.data('table');
			$j.each(table.children().children('tr'), function(i, tr) {
				if($j(tr).data('pid') == t.p && $j(tr).data('oid')==t.o)
					$j(tr).hide();
			});
		});
	});
};

WTUtil.prototype.showFacts = function( striples ) {
	$j.each(striples, function(i, t) {
		$j.each(t.sources, function(m, s) {
			var ident = $j('.lodentity[title="' + s + '"]');
			var table = ident.data('table');
			$j.each(table.children().children('tr'), function(i, tr) {
				if($j(tr).data('pid') == t.p && $j(tr).data('oid')==t.o)
					$j(tr).show();
			});
		});
	});
};

WTUtil.prototype.removeDuplicateTriples = function( triples ) {
	var seen = {};
	var newarr = [];
	$j.each(triples, function() {
    	if (seen[this.property]!=this.object) 
			newarr.push(this);
      seen[this.property] = this.object;
	});
	return newarr;
};

WTUtil.prototype.getHelpButton = function( msg ) {
	var win = $j('<div class="jqmWindow"></div>');
	win.append('<h2 style="float:left">' + lpMsg('Help Window') +'</h2><a href="#" style="float:right" class="jqmClose">' + lpMsg('Close') + '</a><hr style="clear:both"/>');
	win.append(lpMsg('help-' + msg));
	$j(document.body).append(win);
	win.jqm();

	var ah = $j('<a class="helpbutton lodlink"></a>');
	ah.click(function(){ win.jqmShow();});
	return ah;
};

