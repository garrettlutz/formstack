Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
    "use strict";
    if (null === this) throw new TypeError;
    var t = Object(this),
        i = t.length >>> 0;
    if (0 == i) return -1;
    var r = 0;
    if (0 < arguments.length && ((r = Number(arguments[1])) != r ? r = 0 : 0 !== r && r != 1 / 0 && r != -1 / 0 && (r = (0 < r || -1) * Math.floor(Math.abs(r)))), i <= r) return -1;
    for (var a = 0 <= r ? r : Math.max(i - Math.abs(r), 0); a < i; a++)
        if (a in t && t[a] === e) return a;
    return -1
}), Array.prototype.reduce || (Array.prototype.reduce = function(e) {
    "use strict";
    if (null == this) throw new TypeError("Array.prototype.reduce called on null or undefined");
    if ("function" != typeof e) throw new TypeError(e + " is not a function");
    var t, i = Object(this),
        r = i.length >>> 0,
        a = 0;
    if (2 == arguments.length) t = arguments[1];
    else {
        for (; a < r && !(a in i);) a++;
        if (r <= a) throw new TypeError("Reduce of empty array with no initial value");
        t = i[a++]
    }
    for (; a < r; a++) a in i && (t = e(t, i[a], a, i));
    return t
}), "function" != typeof Object.assign && Object.defineProperty(Object, "assign", {
    value: function(e, t) {
        "use strict";
        if (null == e) throw new TypeError("Cannot convert undefined or null to object");
        for (var i = Object(e), r = 1; r < arguments.length; r++) {
            var a = arguments[r];
            if (null != a)
                for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (i[n] = a[n])
        }
        return i
    },
    writable: !0,
    configurable: !0
}), Number.prototype.toFixed = function(e) {
    e = 20 < (e = e || 0) ? 20 : e;
    var t = Math.pow(10, e),
        i = (Math.round(Math.round(this * t * 100) / 100) / t).toString();
    return 0 <= i.indexOf(".") ? i + t.toString().substr(i.length - i.indexOf(".")) : 0 === e ? i : i + "." + t.toString().substr(1)
}, jQuery.noConflict(),
function(window, $) {
    "use strict";
    var console = window.console || {
            log: function() {},
            warn: function() {},
            error: function() {}
        },
        Formstack = window.Formstack || {},
        Fj;
    Formstack.Form = function(e, t) {
        this.id = e, this.baseUrl = t, this.currentPage = 1, this.pages = $("div.fsPage").length, this.logicFields = [], this.checks = [], this.hasHtml5Validation = "object" == typeof document.createElement("input").validity, this.customSubmissionHandler = !1, this.jsonp = !1, this.calculations = [], this.calcFields = [], this.dateCalculations = [], this.dateCalcFields = [], this.validate = !0, this.forLogic = !1, this.failedContainers = [], this.onChange = !1, this.touched = !1, this.form = jQuery("#fsForm" + this.id), this.skipPageValidation = jQuery("#fsSkipPageValidation").val(), this.skipValidation = !1, this.initializing = !1, this.fireLogicEvents = !1, this.bottleneckFieldId = null, this.viewparam = jQuery("#viewparam").val(), this.lastActiveCalloutId = null, this.disableNavigation = !1, this.isWorkflowForm = !1, this.workflowSections = {}, this.workflowFields = {}, this.isSaveResumeEnabled = !!jQuery("#isSaveResumeEnabled").length, 1 < this.pages && ($("#fsNextButton" + this.id).click($.proxy(this.nextPage, this)), $("#fsPreviousButton" + this.id).click($.proxy(this.previousPage, this))), this.hasHtml5Validation || (document.getElementById("fsForm" + this.id).novalidate = !1), this.integrations = {}, this.plugins = {}, $("#fsSendStepBackButton" + this.id).on("click", $.proxy(this.onSendBack, this))
    }, Formstack.Form.prototype.onSendBack = function() {
        var e = $("#fsSendStepBackButton" + this.id),
            t = e.data("message-prompt"),
            i = e.data("title-prompt"),
            i = {
                confirm: e.data("confirm-prompt"),
                goodies: ["textarea"],
                message: t,
                title: i
            };
        $(".fs-form-dialog__textarea").attr("aria-label", t);
        var r = this;
        this.launchDialog(i, function(e) {
            e = e.textarea;
            null != e && ($("#fsSendStepBackComment" + r.id).attr("value", e), $("#fsIsSendStepBack" + r.id).attr("value", "1"), r.validate = !1, r.form.submit())
        })
    }, Formstack.Form.prototype.resetSubmitButton = function() {
        var e = document.getElementById("fsSubmitButton" + this.id),
            t = document.getElementById("submitButtonText");
        e && t && (e.value = t.innerHTML)
    }, Formstack.Form.prototype.createInput = function(e, t, i, r) {
        var a = document.getElementById("fsForm" + this.id),
            n = document.createElement("input");
        return n.setAttribute("name", t), n.setAttribute("id", e), n.setAttribute("type", i || "hidden"), n.value = r || "", a.appendChild(n), n
    }, Formstack.Form.prototype.getFieldGroup = function(e) {
        var t = $(".fsField"),
            i = [],
            r = new RegExp("^field" + e + "($|_|-)");
        return t.each(function(e, t) {
            r.test(t.id) && i.push(t)
        }), i
    }, Formstack.Form.prototype.isLastPage = function(e) {
        if (1 == this.pages) return !0;
        for (var t = 1, i = 1; i <= this.pages; i++) this.pageIsVisible(i) && (t = i);
        return e == t
    }, Formstack.Form.prototype.nextPage = function() {
        if (!(this.disableNavigation || this.currentPage + 1 > this.pages)) {
            if (!this.skipPageValidation)
                if (!this.checkPage(this.currentPage)) return void this.form.trigger("form:validation-error");
            document.getElementById("fsPage" + this.id + "-" + this.currentPage);
            for (var e = 1; !this.pageIsVisible(this.currentPage + e) && this.currentPage + e < this.pages;) e++;
            var t = this.currentPage + e;
            this.changePage(this.currentPage, t)
        }
    }, Formstack.Form.prototype.previousPage = function(e) {
        if (!this.disableNavigation && this.currentPage - 1 != 0) {
            document.getElementById("fsPage" + this.id + "-" + this.currentPage);
            for (var t = 1; !this.pageIsVisible(this.currentPage - t) && 1 < this.currentPage - t;) t++;
            var i = this.currentPage - t;
            this.changePage(this.currentPage, i)
        }
    }, Formstack.Form.prototype.checkPage = function(e) {
        var t;
        if (!this.validate) return !0;
        var i = document.getElementById("fsPage" + this.id + "-" + e),
            r = $(i).find("input:not([data-skip-validation]), select.fsFormatMaxDate, textarea"),
            a = 0;
        for (this.failedContainers = [], t = 0; t < r.length; t++) this.checkFormat(r[t]) && a++;
        e = r.length === a;
        if (!e) return !1;
        var n = !0;
        return $(i).find(".fsFieldCell").each(function(e, t) {
            n = this._applyRequiredFieldValidation(t) && n
        }.bind(this)), e && n ? $("#fsError" + this.id).remove() : this.focusFirstError(), e && n
    }, Formstack.Form.prototype.initLogic = function() {
        for (var e = 0; e < this.logicFields.length; e++)
            for (var t = this.getFields(this.logicFields[e], !0), i = 0; i < t.length; i++) {
                t[i].type.toLowerCase();
                $(t[i]).bind("change", $.proxy(this.checkLogic, this)), this.checkLogic(t[i])
            }
    }, Formstack.Form.prototype.initCalculations = function() {
        for (var e = 0; e < this.calcFields.length; e++) {
            for (var t = this.calcFields[e].match(/(\d+)/)[1], i = this.getFields(t), r = 0; r < i.length; r++) {
                var a = i[r];
                a.type.toLowerCase();
                $(a).bind("change", $.proxy(this.updateCalculations, this))
            }
            var n = document.getElementById("field" + t + "_othervalue");
            n && $(n).bind("change", $.proxy(function(e) {
                var t, i = null,
                    r = "",
                    a = "";
                e && (a = -1 != (t = e.currentTarget.id.indexOf("_othervalue")) ? (r = e.currentTarget.id.substring(0, t), e.currentTarget.id.substring(5, t)) : e.currentTarget.id.substring(5)), n = document.getElementById(r + "_othervalue"), (i = document.getElementById(r + "_other")) && (i.checked = "" !== n.value), this.updateCalculations(a), this.checkLogic(a)
            }, this))
        }
        for (e = 0; e < this.calculations.length; e++) this.evalCalculation(this.calculations[e])
    }, Formstack.Form.prototype.initDateCalculations = function() {
        for (var e = 0, t = this.dateCalcFields.length; e < t; e++)
            for (var i = this.dateCalcFields[e].match(/(\d+)/)[1], r = this.getFields(i, !0), a = 0, n = r.length; a < n; a++) $(r[a]).bind("change", $.proxy(this.updateDateCalculations, this));
        for (e = 0; e < this.dateCalculations.length; e++) this.evalDateCalculation(this.dateCalculations[e])
    }, Formstack.Form.prototype.initFields = function() {
        this.setMinuteOptions(),
        $("div[fs-field-validation-name='Ideal Photo Shoot Start Time'] select").each(function(e) {
            e.bind("change", $.proxy(function(){
                this.updateIdealTime();
            }, this));
        }),        
        $(".fsField.fsRequired").bind("change", $.proxy(function(e) {
            this.checkRequired(e.target, !0)
        }, this)), 
        $("div[fs-field-validation-name='ConsecutiveDateFields'] textarea").val().split(";").forEach(function(e) {
            //var fs = this;
            var fieldId = $("div[fs-field-validation-name='" + e + "']").get(0).id.match(/(\d+)/)[1],
            t = $("#field" + fieldId + "Y"),
            i = $("#field" + fieldId + "M"),
            r = $("#field" + fieldId + "D");
            
            t.bind("change", $.proxy(function(e) {
                
                this.updateConsecutiveDate(e, !0)
                this.updateFormatedRequestedDates(e, !0)
            }, this));
            i.bind("change", $.proxy(function(e) {
                
                this.updateConsecutiveDate(e, !0)
                this.updateFormatedRequestedDates(e, !0)
            }, this));
            r.bind("change", $.proxy(function(e) {
                
                this.updateConsecutiveDate(e, !0)
                this.updateFormatedRequestedDates(e, !0)
            }, this));

        }, this)
        ,
        $(".fsField").bind("change", $.proxy(function(e, state=!0, stateTwo=!0) {
            this.checkFormat(e.target, state, stateTwo)
        }, this)),
         $(".fsCheckAllOption").bind("change", $.proxy(function(e) {
            Formstack.Util.checkAll(e)
        }, this)), $(".fsField.fsFormatNumber.fsRequired").bind("blur", $.proxy(function(e) {
            this.checkRequired(e.target, !0)
        }, this)), $(".fsField.fsFormatNumber").bind("blur", $.proxy(function(e) {
            this.checkFormat(e.target, !0)
        }, this)), $('.fsRowBody.fsReadOnly[fs-field-type="datetime"]').find("select").bind("focus mousedown", $.proxy(function(e) {
            e.stopPropagation(), e.preventDefault(), e.currentTarget.blur()
        }, this)), $("input.fsOtherField").change(function(e) {
            var t = $(this).attr("id").split("_")[0],
                t = $("#" + t + "_other");
            t.prop("checked", "" !== $(this).val()), t.trigger("change")
        }), this.createInput("fsUserAgent", "fsUserAgent", "hidden", navigator.userAgent), $(":not(input:radio, input:checkbox).fsField, .fsReactInteractiveInput").focus($.proxy(this.focus, this)), $(":not(input:radio, input:checkbox).fsField, .fsReactInteractiveInput").blur($.proxy(this.focus, this)), $("input:radio.fsField, input:checkbox.fsField").click($.proxy(this.focus, this)), $("div.fsCallout").each(function(e) {
            $(this).hide()
        })
    }, Formstack.Form.prototype.initMatrixes = function() {
        $("table.fsMatrixOnePerColumn input").each($.proxy(function(e, t) {
            var i = t.type.toLowerCase();
            "radio" != i && "checkbox" != i || $(t).click($.proxy(function(e) {
                this.checkMatrixOnePerColumn(t.id)
            }, this))
        }, this))
    }, Formstack.Form.prototype.getSignatureImageData = function(e) {
        var t = this.getFieldId(e),
            e = $("#field" + t).val(),
            t = e && e.substr(0, 10);
        return e && "data:image" === t ? e : null
    }, Formstack.Form.prototype.initSignatures = function() {
        $(".fsSignature").each($.proxy(function(e, t) {
            var i = this.getFieldId(t.id);
            $(t).jSignature({
                sizeRatio: this.getJSignatureRatio()
            }), $(t).bind("change", function(e) {
                0 < $(e.target).jSignature("getSettings").data.length && $("#field" + i).val($(e.target).jSignature("getData"))
            }), $("#signatureClear" + i).bind("click", function(e) {
                $(t).jSignature("reset"), $("#field" + i).val()
            });
            var r = this.getSignatureImageData(t.id);
            this.isSaveResumeEnabled && r && $(t).jSignature("setData", r)
        }, this))
    }, Formstack.Form.prototype.isSurvey = function() {
        return document.body.classList.contains("survey-mode")
    }, Formstack.Form.prototype.isLandscape = function() {
        return document.body.clientWidth / document.body.clientHeight < 1
    }, Formstack.Form.prototype.getJSignatureRatio = function() {
        if (!this.isSurvey()) return 4;
        var e = this.isSurvey() ? 3 : 4;
        return this.isLandscape() ? 1 : e
    }, Formstack.Form.prototype.initTextAreas = function() {
        $("textarea.fsTextAreaMaxLength").each($.proxy(function(e, t) {
            var i = t.id.match(/(\d+)/)[1],
                t = $(t),
                r = $("#fsCounter" + i),
                a = t.attr("maxlength");
            0 < a && (t.keyup($.proxy(function(e) {
                this.textareaCharLimiter(i, a)
            }, this)), t.data("x", t.outerWidth()), t.data("y", t.outerHeight()), t.mouseup($.proxy(function(e) {
                e = jQuery(e.target);
                e.outerWidth() === e.data("x") && e.outerHeight() === e.data("y") || r.width(e.outerWidth()), e.data("x", e.outerWidth()), e.data("y", e.outerHeight())
            })), r.width(t.outerWidth()), r.text(a + "/" + a), r.show())
        }, this))
    }, Formstack.Form.prototype.getCalendarFormat = function(e) {
        var t = "mm/dd/yy";
        if (!e) return t;
        e = document.getElementById("field" + e + "Format");
        if (!e) return t;
        switch (e.value) {
            case "DMY":
                return "dd/mm/yy";
            case "YMD":
                return "yy/mm/dd";
            case "MY":
                return "mm/yy/dd";
            default:
                return t
        }
    }, Formstack.Form.prototype.initCalendars = function() {
        for (var o = {
                "01": 31,
                "02": 28,
                "03": 31,
                "04": 30,
                "05": 31,
                "06": 30,
                "07": 31,
                "08": 31,
                "09": 30,
                10: 31,
                11: 30,
                12: 31,
                Jan: 31,
                January: 31,
                Feb: 28,
                February: 28,
                Mar: 31,
                March: 31,
                Apr: 30,
                April: 30,
                May: 31,
                Jun: 30,
                June: 30,
                Jul: 31,
                July: 31,
                Aug: 31,
                August: 31,
                Sep: 30,
                September: 30,
                Oct: 31,
                October: 31,
                Nov: 30,
                November: 30,
                Dec: 31,
                December: 31
            }, e = $("div .fsCalendar").get(), t = 0; t < e.length; t++) {
            var i = e[t],
                r = (r = i.id.match(/(\d+)/))[1],
                a = document.getElementById("field" + r + "Y").options,
                n = parseInt(a[1].value, 10),
                s = parseInt(a[a.length - 1].value, 10),
                myMinDate,
                l = (new Date).getFullYear();
            n < 100 && (n += l - 2e3 < n ? 1900 : 2e3), s < 100 && (s += 2e3);
            a = this.getCalendarFormat(r), l = $("#" + i.id + "Link");
            if (!$.datepicker) return void l.css("display", "none");
            i = document.getElementById("field" + r + "MaxDate"), s = i ? new Date(i.value) : new Date(s, 11, 31);
            l.datepicker({
                //minDate: (myMinDate = document.querySelector("div[fs-field-validation-name='MinDate'] input").value, myMinDate ? new Date(myMinDate) :  new Date(n, 0, 1)),
                minDate: this.determineMinDate(),
                maxDate: s,
                buttonImage: $("#fsCalendar" + r + "ImageUrl").html(),
                buttonImageOnly: !0,
                beforeShow: this.calendarShow,
                onSelect: this.calendarSelect,
                showOn: "both",
                dateFormat: a,
                beforeShowDay: this.checkDisabledDates,
                buttonText: "Select Date"
            }), $("#field" + r + "M").change(function() {
                var e = $(this).attr("id").replace(/\D/g, ""),
                    t = $("#field" + e + "D"),
                    i = $("#field" + e + "Y").find("option:selected").val(),
                    e = $(this).find("option:selected").val(),
                    r = o[e];
                "Feb" != e && "February" != e && "02" != e || "" == i || (i % 4 == 0 && i % 100 != 0 || i % 400 == 0) && (r = 29);
                for (var a = 29; a <= 31; a++) {
                    var n = t.find("option[value='" + a + "']");
                    a <= r ? n.show() : n.hide()
                }
                i = t.find("option:selected");
                i.val() > r && i.attr("selected", !1)
            }), $("#field" + r + "Y").change(function() {
                var e = $(this).attr("id").replace(/\D/g, ""),
                    t = $(this).find("option:selected").val(),
                    i = $("#field" + e + "D"),
                    e = $("#field" + e + "M");
                e.find("option:selected") && ("Feb" != (e = e.find("option:selected").val()) && "February" != e && "02" != e || (i = i.find("option[value='29']"), t % 4 == 0 && t % 100 != 0 || t % 400 == 0 ? i.show() : (i.attr("selected", !1), i.hide())))
            })
        }
        $("#fsForm" + this.id + " .ui-datepicker-trigger").attr("aria-hidden", !0)
    }, Formstack.Form.prototype.determineMinDate = function(){
        var myMinDate = document.querySelector("div[fs-field-validation-name='MinDate'] input").value;        
        if (myMinDate){            
            var parsedDate = this.parseDateString(myMinDate);
            if (parsedDate){
                return parsedDate;
            }
        }

        var today = new Date();
        today.setHours(0,0,0,0);
        return today;
        
    }, Formstack.Form.prototype.parseDateString = function(e) {

        const reg = new RegExp('(today|tomorrow|\\+|\\-|[0-9]{1,2}/[0-9]{1,2}/[0-9]{2}(?:[0-9]{2})?|[0-9]+|\\s|\\S)','g');
        const matches = e.toLowerCase().matchAll(reg);
        var dateExpression = [];
        for (const match of matches) {
            if (match[0] == 'today')
            {
                var today = new Date();
                today.setHours(0,0,0,0);
                dateExpression.push(today);                
            }
            else if(match[0] == 'tomorrow'){
                var tomorrow = new Date();
                tomorrow.setHours(0,0,0,0);
                tomorrow.setDate(tomorrow.getDate() + 1);
                dateExpression.push(tomorrow);                
            }            
            else if(match[0] == '+'){
                dateExpression.push('ADD');                
            }
            else if(match[0] == ('-')){
                dateExpression.push('SUBTRACT')                
            }
            else if(match[0].match('[0-9]{1,2}/[0-9]{1,2}/[0-9]{2}(?:\d{2})?') != null){
                var customDate = new Date(match[0])
                if (!isNaN(customDate)){
                    dateExpression.push(customDate);
                }
                else {
                    alert('Error: the minDate is invalid');
                    return null;
                }
            }
            else if(match[0].match('[0-9]+') != null){
                dateExpression.push(parseInt(match[0]))
            }
            else if(match[0].match('\\s+') != null){
                continue;
            }
            else {
                alert('Error: the minDate is invalid');
                return null;
            }            
        }

        
        if (dateExpression.length > 0 && dateExpression[0] instanceof Date){
            var startDate = dateExpression[0];
            
            if (dateExpression.length > 1){

                if('string' == typeof dateExpression[1]){

                    if (dateExpression[1] == 'ADD'){
                        if (dateExpression.length > 2 && 'number' == typeof dateExpression[2]){
                            startDate.setDate(startDate.getDate() + dateExpression[2])
                            return startDate;
                        }
                        else {
                            alert('Error: the minDate is invalid');
                            return null;
                        }
                    } else 
                    {
                        if (dateExpression.length > 2 && 'number' == typeof dateExpression[2]){
                            startDate.setDate(startDate.getDate() - dateExpression[2])
                            return startDate;
                        }
                        else {
                            alert('Error: the minDate is invalid');
                            return null;
                        }
                    }
                }
                else {
                    alert('Error: the minDate is invalid');
                    return null;
                }
            }
            else {
                return startDate;
            }
        } 
        else if(dateExpression.length > 0 && 'number' == typeof dateExpression[0]){
            var numberToAdd = dateExpression[0];

            if (dateExpression.length > 1 && 'string' == typeof dateExpression[1]){
                if (dateExpression[1] == 'ADD'){
                    if (dateExpression.length > 2 && dateExpression[2] instanceof Date){
                        var minDate = dateExpression[2];
                        minDate.setDate(minDate.getDate() + numberToAdd)
                        return minDate;
                    }
                    else {
                        alert('Error: the minDate is invalid');
                        return null;
                    }
                } else 
                {
                    if (dateExpression.length > 2 && dateExpression[2] instanceof Date){
                        var minDate = dateExpression[2];
                        minDate.setDate(minDate.getDate() - numberToAdd)
                        return minDate;
                    }
                    else {
                        alert('Error: the minDate is invalid');
                        return null;
                    }
                }
            }
            else {
                alert('Error: the minDate is invalid');
                return null;
            }
        }
        else {
            return null
        }

    }, Formstack.Form.prototype.initAutocompletes = function() {
        $(".fsAutocomplete").each($.proxy(function(e, t) {
            var i = t.id.match(/(\d+)/)[1],
                t = document.getElementById("field" + i),
                i = document.getElementById("field" + i + "_options").value;
            $(t).autocomplete({
                source: i.split("|")
            })
        }))
    }, Formstack.Form.prototype.initSliders = function() {
        $(".fsSliderDiv").each($.proxy(function(e, t) {
            var i, r, a = t.id.match(/(\d+)/)[1],
                n = document.getElementById("field" + a),
                o = this.getNumberProperties(n);
            isNaN(o.min) || isNaN(o.max) || (i = document.getElementById(n.id + "-slidervalue"), r = "" !== n.val ? parseFloat(n.value) : o.min, isNaN(r) && (r = o.min), a = document.querySelector('[href*="default-v4.css"]'), $(t).slider({
                start: $.proxy(this.focus, this),
                stop: $.proxy(this.focus, this),
                min: o.min,
                max: o.max,
                value: r,
                form: this,
                num: o,
                field: n,
                slideval: i,
                range: !!a && "min"
            }), isNaN(o.decimals) || (r = r.toFixed(o.decimals)), n.value = r, i.innerHTML = Formstack.Util.formatNumber(o, r), $(t).bind("slide", function(e, t) {
                var i = $(this).slider("option", "form"),
                    r = ($(this).slider("option", "num"), $(this).slider("option", "field")),
                    a = $(this).slider("option", "slideval"),
                    n = i.getNumberProperties(r),
                    t = t.value;
                r.value = t, a.innerHTML = Formstack.Util.formatNumber(n, t);
                r = r.id.match(/(\d+)/)[1];
                0 <= i.calcFields.indexOf(r) && i.updateCalculations(r), 0 <= i.dateCalcFields.indexOf(r) && i.updateDateCalculations(r), 0 <= i.logicFields.indexOf(r) && i.checkLogic(r)
            }))
        }, this))
    }, Formstack.Form.prototype.initSaveResume = function() {
        $(".fsSaveIncomplete").click($.proxy(this.saveIncomplete, this))
    }, Formstack.Form.prototype.initPayments = function() {
        var e;
        document.querySelector('[fs-field-type="creditcard"]') && (this.paymentIntegrations = {}, e = (e = document.getElementById("fsForm" + this.id).getAttribute("action")).substring(0, e.lastIndexOf("/")) + "/integration.php", $.ajax({
            url: e,
            dataType: "json",
            data: {
                f: this.id,
                i: "payment",
                v: document.querySelector('[name="viewkey"]').value
            },
            success: function(e) {
                for (var t in e.data) {
                    var i;
                    e.data.hasOwnProperty(t) && ("function" == typeof this[i = "init" + t.charAt(0).toUpperCase() + t.slice(1)] && this[i](e.data[t]))
                }
            }.bind(this)
        }))
    }, Formstack.Form.prototype.initPaypalpro = function(e) {
        e.cardinal_cruise && this.initCardinalCruise(e.id, e.cardinal_cruise)
    }, Formstack.Form.prototype.initCardinalCruise = function(i, e) {
        var t, r, a, n, o, s, l = document.getElementById("field" + e.field_map.card + "-card"),
            d = document.getElementById("field" + e.field_map.card + "-cardexp");
        l && (t = e.field_map.quantity.replace("-quantity", ""), (r = document.getElementById("field" + t)) && (jQuery.getScript(e.songbirdJsUrl, function() {
            Cardinal.configure({
                logging: {
                    level: "off"
                }
            })
        }), n = (a = e.field_map.unit_price.match("^([0-9]+)-unit_price$")) ? function() {
            var e = a[1];
            return document.getElementById("field" + e).getAttribute("data-product-price")
        } : function() {
            return document.getElementById("field" + e.field_map.unit_price).value
        }, o = jQuery(l).parents("form"), s = this, o.submit(function(e) {
            if (o.data("skip-cardinal-cruise")) return !0;
            var t = r.value * n() * 100;
            0 < t && "" != l.val && (e.preventDefault(), jQuery.get("/admin/cardinal_cruise/" + i, {
                totalPrice: t
            }, function(i) {
                Cardinal.on("payments.setupComplete", function() {
                    Cardinal.trigger("bin.process", l.value.replace(/ /g, "")).then(function(e) {
                        var t = {
                            OrderDetails: {
                                OrderNumber: i.orderNumber
                            },
                            Consumer: {
                                Account: {
                                    AccountNumber: l.value.replace(/ /g, ""),
                                    ExpirationMonth: d.value.split(" / ")[0],
                                    ExpirationYear: "20" + d.value.split(" / ")[1]
                                }
                            }
                        };
                        Cardinal.start("cca", t)
                    })
                }), Cardinal.on("payments.validated", function(e, t) {
                    switch (e.ActionCode) {
                        case "SUCCESS":
                        case "NOACTION":
                            var i = jQuery("<input>", {
                                type: "hidden",
                                value: t,
                                name: "cardinal_cruise_jwt"
                            });
                            o.append(i), o.data("skip-cardinal-cruise", !0), o.submit();
                            break;
                        default:
                            s.showError("Payment authentication failed. Please submit the form again.", !0);
                            i = $("input.fsSubmitButton");
                            (i.length ? i[0] : null).value = "Submit Form"
                    }
                }), Cardinal.setup("init", {
                    jwt: i.jwtToken
                })
            }))
        })))
    }, Formstack.Form.prototype.loadStripeJs = function(e) {
        var t = document.createElement("script");
        return t.type = "text/javascript", t.src = "https://js.stripe.com/" + e, document.getElementsByTagName("head")[0].appendChild(t), t
    }, Formstack.Form.prototype.makeStripeV3Container = function(e, t) {
        return '<div class="fsRow fsFieldRow fsLastRow" id="stripe-container' + e + '"><div id="' + t + '" style="padding: 9px; background-color: #fff; border: 1px solid #cfd4d8;"></div></div>'
    }, Formstack.Form.prototype.initStripe = function(e) {
        this.paymentIntegrations.stripe = {};
        var t = this.paymentIntegrations.stripe;
        if (!e.publishable_key) {
            var i = document.getElementById("paymentInitError"),
                r = i && i.innerHTML ? i.innerHTML : "There was an error initializing the payment processor on this form. Please contact the form owner to correct this issue.";
            return this.showError(r), t.key = "error", void(document.getElementById("fsSubmitButton" + this.id).disabled = !0)
        }
        var a = this.loadStripeJs("v3"),
            n = e.field_map.card_num || null,
            o = $(this.getLogicTarget(n)),
            s = "card-element" + n,
            l = this.makeStripeV3Container(n, s);
        $("#FsFieldContainer" + n).show(), o.find(".fsCreditcardFieldContainer").hide().after(l), a.onload = $.proxy(function() {
            var e = Stripe(this.paymentIntegrations.stripe.key, {
                    locale: o.attr("lang")
                }),
                t = e.elements().create("card", {
                    style: {
                        base: {
                            fontSize: "15px"
                        }
                    },
                    hidePostalCode: !0
                });
            t.on("change", $.proxy(function(e) {
                e.error ? (this.highlightField(o.find("input")[0], !0, e.error.message), this.showError(e.error.message, !1)) : (this.highlightField(o.find("input")[0], !1), this.hideError())
            }, this)), t.on("change", $.proxy(function(e) {
                this.paymentIntegrations.stripe.fieldCompleted = e.complete
            }, this)), t.mount("#" + s), this.stripeCard = t, this.stripe = e
        }, this), t.mappings = {}, t.key = e.publishable_key;
        var i = "card_num",
            r = "exp_date",
            n = "exp_month",
            l = "exp_year",
            a = "card_code",
            d = Object.assign({}, e.field_map);
        d[i] = d[i] + "-card", d[n] = d[r] + "-cardexp", d[l] = d[r] + "-cardexp", d[a] = d[a] + "-cvv";
        var c, u = {
            card_num: "number",
            card_code: "cvc",
            address: "address_line1",
            city: "address_city",
            country: "address_country",
            state: "address_state",
            zip: "address_zip"
        };
        for (c in d)
            if (d.hasOwnProperty(c) && d[c]) {
                var m = document.getElementById("field" + d[c]),
                    h = d[c];
                if (!m) {
                    m = c;
                    if ("name" === m.slice(-4) && (m = m.substr(0, m.length - 5)), !document.getElementById("field" + e.field_map[c] + "-" + m)) continue;
                    h += "-" + m
                }
                u[c] ? t.mappings[u[c]] = h : t.mappings[c] = h
            }
    }, Formstack.Form.prototype.isStripeCCFieldCompleted = function() {
        return this.paymentIntegrations.stripe.fieldCompleted || !1
    }, Formstack.Form.prototype.isStripeCCFieldDisabled = function() {
        var e, t = this.paymentIntegrations.stripe.mappings;
        for (e in t)
            if (t.hasOwnProperty(e)) {
                var i = document.getElementById("field" + t[e]);
                if (i && "number" === e && i.disabled) return !0
            } return !1
    }, Formstack.Form.prototype.fieldManagedByStripe = function(e) {
        if (!this.paymentIntegrations || !this.paymentIntegrations.stripe) return !1;
        var t = this.paymentIntegrations.stripe.mappings;
        if (!t) return !1;
        var i, r = t.cvc || t.number.split("-")[0] + "-cvv",
            a = ["number", "exp_year", "exp_month", "cvc"];
        for (i in t)
            if (t.hasOwnProperty(i) && -1 !== a.indexOf(i) && (e.id === "field" + t[i] || e.id === "field" + r)) return !0;
        return !1
    }, Formstack.Form.prototype.collectStripeBillingDetails = function() {
        var e, t = {},
            i = this.paymentIntegrations.stripe.mappings;
        for (e in i)
            if (i.hasOwnProperty(e) && "first_name" !== e && "last_name" !== e) {
                var r = document.getElementById("field" + i[e]);
                if (r) {
                    var a = r.value;
                    if ("exp_month" === e && (a = a.split(" / ")[0]), "exp_year" === e && (a = a.split(" / ")[1]), "address_country" === e) {
                        if (!r.options) continue;
                        r = r.options[r.selectedIndex];
                        !0 === r.hasAttribute("data-country-code") && (a = r.getAttribute("data-country-code"))
                    }
                    t[e] = a
                }
            } return (i.first_name || i.last_name) && (t.name = "", i.first_name && (t.name += document.getElementById("field" + i.first_name).value), t.name && (t.name += " "), i.last_name && (t.name += document.getElementById("field" + i.last_name).value)), t
    }, Formstack.Form.prototype.prepareStripe = function() {
        var e = this.collectStripeBillingDetails();
        return !(!Stripe || !this.paymentIntegrations.stripe.mappings) && (this.isStripeCCFieldDisabled() ? (this.paymentIntegrations.stripe.success = !0, this.checkIntegrationsComplete("payment"), !0) : (this.stripe.createPaymentMethod("card", this.stripeCard, {
            billing_details: {
                name: e.name || null,
                address: {
                    city: e.address_city,
                    country: e.address_country,
                    line1: e.address_line1,
                    line2: e.address_line2,
                    postal_code: e.address_zip,
                    state: e.address_state
                },
                email: e.email || null
            }
        }).then($.proxy(function(e) {
            var t, i, r, a;
            e.error ? (this.showError(e.error.message, !0), delete this.paymentIntegrations.stripe.success) : (t = document.getElementById("fsForm" + this.id), (r = document.createElement("input")).type = "hidden", r.name = "stripe_paymentMethod_id", r.id = "stripe_paymentMethod_id", r.value = e.paymentMethod.id, t.appendChild(r), a = this.paymentIntegrations.stripe.mappings, (i = document.createElement("input")).type = "hidden", i.name = "field" + a.number, i.id = i.name, i.value = e.paymentMethod.card.last4, t.appendChild(i), r = document.createElement("input"), i = e.paymentMethod.card.exp_month, e = e.paymentMethod.card.exp_year.toString().substr(2), r.type = "hidden", r.name = "field" + a.exp_month, r.id = r.name, r.value = i + " / " + e, t.appendChild(r), (r = document.createElement("input")).type = "hidden", a = a.cvc || a.number.split("-")[0] + "-cvv", r.name = "field" + a, r.id = r.name, r.value = "000", t.appendChild(r), this.paymentIntegrations.stripe.success = !0, this.checkIntegrationsComplete("payment"))
        }, this)), !1))
    }, Formstack.Form.prototype.isDeviceIOS = function() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    }, Formstack.Form.prototype.loseHeaderElements = function(e) {
        e && (480 < document.body.clientWidth && this.isDeviceIOS() ? e.css({
            position: "absolute",
            height: 88 + (window.pageYOffset || document.documentElement.scrollTop) + "px"
        }) : this.fixHeaderElements(e))
    }, Formstack.Form.prototype.fixHeaderElements = function(e) {
        e.css({
            position: "",
            height: ""
        })
    }, Formstack.Form.prototype.initIOS = function() {
        var e, t;
        this.isSurvey() && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && (e = $(".survey-header"), this.loseHeaderElements(e), t = this, $(document).on("scroll", function() {
            t.loseHeaderElements(e)
        })), $(".fsIOSUpload").click(function(e) {
            e.stopPropagation();
            e = e.target.id.match(/(\d+)/)[1];
            return Formstack.IOS.fileUpload(e), !1
        }), $(".js-ios-scanCreditCard").click(function(e) {
            e.stopPropagation();
            e = e.target.getAttribute("data-id");
            return Formstack.IOS.scanCreditCard(e), !1
        })
    }, Formstack.Form.prototype.initAndroid = function() {
        $(".js-android-scanCreditCard").click(function(e) {
            e.stopPropagation();
            e = e.target.getAttribute("data-id");
            return Formstack.Android.scanCreditCard(e), !1
        })
    }, Formstack.Form.prototype.init = function() {
        $("#fsForm" + this.id).submit($.proxy(this.submit, this)), this.initializing = !0;
        var e;
        if (-1 !== [1804069].indexOf(this.id)) return $("#fsForm" + this.id).html(""), void window.location.assign("http://www.google.com");
        1 < this.pages ? $("#fsForm" + this.id).bind("keypress", $.proxy(function(e) {
            if (13 != e.keyCode) return !0;
            if (document.activeElement) {
                if ("TEXTAREA" == document.activeElement.tagName || $(document.activeElement).is(".fsPreviousButton")) return !0;
                this.updateCalculations(document.activeElement.id.substring(5)), this.updateDateCalculations(document.activeElement.id.substring(5)), this.checkLogic(document.activeElement.id.substring(5))
            }
            return this.currentPage == this.pages ? this.form.submit() : this.nextPage(), e.stopPropagation(), !1
        }, this)) : 0 < (e = $(".fsProgress")).length && $(e).hide(), this.initWelcomeMessage(), this.initSignatures(), this.initCalculations(), this.initDateCalculations(), this.initLogic(), this.initFields(), this.initMatrixes(), this.initTextAreas(), this.initCalendars(), this.initAutocompletes(), this.initSliders(), this.initSaveResume(), this.initPayments(), this.checkNavigation(), this.updateProgress(1), this.checkFreeLink() && (this.initIOS(), this.initAndroid()), this.initializing = !1
    }, Formstack.Form.prototype.initWelcomeMessage = function() {
        function e() {
            for (var e = $(".fsSignature"), t = 0; t < e.length; t++) i.isSurvey() ? ($(e[t]).empty(), $(e[t]).jSignature({
                sizeRatio: i.getJSignatureRatio()
            })) : ($(e[t]).empty(), $(e[t]).jSignature())
        }
        var t, i = this,
            r = document.querySelector(".fsWelcomeMessage");
        null !== r && (null !== (t = document.querySelector(".fsWelcomeMessage__start-button")) ? t : r).addEventListener("click", function() {
            r.classList.add("fsWelcomeMessage--hidden"), e()
        })
    }, Formstack.Form.prototype.checkNavigation = function() {
        var e = document.getElementById("fsSubmitButton" + this.id),
            t = document.getElementById("fsNextButton" + this.id),
            i = document.getElementById("fsCaptcha" + this.id),
            r = this.isLastPage(this.currentPage);
        i && (i.style.display = r ? "" : "none"), e && (e.style.display = r ? "" : "none"), t && (t.style.display = r ? "none" : "")
    }, Formstack.Form.prototype.focus = function(e, t) {
        var i, r;
        /MSIE 6/i.test(navigator.userAgent) || (i = "focus", "radio" !== e.currentTarget.type && "checkbox" !== e.currentTarget.type || (i = "click"), r = "object" == typeof e && "target" in e ? e.target : e, t = void 0 === t ? e.type == i : t, "slidestart" !== e.type && "slidestop" !== e.type || (t = "slidestart" === e.type), (r = this.getFieldContainer(r)) && (t ? ($(".fsFieldFocused").removeClass("fsFieldFocused"), $(r).addClass("fsFieldFocused"), this.showCallout(r, !0)) : ($(r).removeClass("fsFieldFocused"), this.showCallout(r, !1))))
    }, Formstack.Form.prototype.showCallout = function(e, t) {
        var i, r = this.getFieldContainer(e).querySelector("div.fsCallout");
        t && r ? (i = r.id.replace(/[^\d.]/g, ""), this.lastActiveCalloutId && this.lastActiveCalloutId !== i && this.closeCallout(), t = $(e).position(), e = Formstack.Util.getHeight(e), $(r).css("top", t.top + e + "px"), $(r).css("left", t.left + 50 + "px"), $(r).css("marginTop", "25px"), $(r).show("fast"), this.lastActiveCalloutId = i, $("#field" + i).on("keyup.closeCallout", null, $.proxy(this.closeCalloutOnEscape, this))) : this.closeCallout()
    }, Formstack.Form.prototype.closeCallout = function() {
        this.lastActiveCalloutId && ($("#field" + this.lastActiveCalloutId).off("keyup.closeCallout"), $("#fsCallout" + this.lastActiveCalloutId).hide("fast"), this.lastActiveCalloutId = null)
    }, Formstack.Form.prototype.closeCalloutOnEscape = function(e) {
        e && 27 !== e.which || this.closeCallout()
    }, Formstack.Form.prototype.fadeCallout = function(e) {
        $(e).hasStyle("fsCalloutShowing") ? $(e).fadeIn() : $(e).fadeOut()
    }, Formstack.Form.prototype.getLogicTarget = function(e) {
        var t = document.getElementById("fsCell" + e);
        return null === t && (t = document.getElementById("fsSection" + e), $(t).hasClass("fsFirstSection")) ? t.parentNode : t
    }, Formstack.Form.prototype.hasHiddenParents = function(e) {
        if (e) {
            for (var t = !1, i = $("#" + e).parents(), r = 0; r < i.length; r++) {
                var a = i[r];
                if ($(a).is(".fsHidden")) {
                    t = !0;
                    break
                }
            }
            return t
        }
    }, Formstack.Form.prototype.showFields = function(e) {
        var t = $(this.getLogicTarget(e));
        if ((t.is(".fsHidden, .fsHiddenPage") || t.hasClass("fsPage")) && !t.is(".fsHiddenByFieldSetting")) {
            for (var i = t.hasClass("fsSection"), r = t.find("input,select,textarea"), a = 0; a < r.length; a++) {
                var n = r[a];
                if ($(n).parent().is(".fsMatrixCol1") || $(n).parent().is(".fsMatrixCol2")) {
                    var o = t.parent(),
                        s = n.id.indexOf("-"),
                        s = n.id.substring(0, s),
                        s = document.getElementById("matrix-" + s + "-fieldset");
                    a += $(s).find("input,select,textarea").length - 1, "disabled" === $(s).attr("disabled") && ($(s).disabled = ""), t.hasClass("fsHidden") && (t.removeClass("fsHidden"), o.removeClass("fsHidden")), t.hasClass("fsPage") && t.children(".fsFirstSection").removeClass("fsHidden"), this.hasHiddenParents(n.id) || (s.disabled = !1)
                } else if (!0 === n.disabled || $(t).is(".fsHidden, .fsHiddenPage")) {
                    o = this.getFieldId(n);
                    if (i)
                        if (t.removeClass("fsHidden"), $(this.getLogicTarget(o)).hasClass("fsHidden")) continue;
                    t.removeClass("fsHidden"), t.hasClass("fsPage") && t.children(".fsFirstSection").removeClass("fsHidden"), t.parent().removeClass("fsHidden");
                    s = $(n).closest(".fsFieldCell");
                    this.hasHiddenParents(n.id) || s.hasClass("fsReadOnly") && "creditcard" === s.attr("fs-field-type") || this.isReadOnlyWorkflowInput(n) || (n.disabled = !1), this.updateCalculations(o), this.updateDateCalculations(o), this.checkLogic(o), this.checkFormat(n)
                }
            }
            for (var l = t.find(".fsSignature"), a = 0; a < l.length; a++) $(l[a]).empty(), $(l[a]).jSignature();
            r.length <= 0 && (t.removeClass("fsHidden"), t.hasClass("fsPage") && t.children(".fsFirstSection").removeClass("fsHidden"), t.parent().removeClass("fsHidden")), -1 != this.logicFields.indexOf(e) && this.checkLogic(e)
        }
    }, Formstack.Form.prototype.hideFields = function(e) {
        var t = $(this.getLogicTarget(e)),
            i = t.find("input:disabled,select:disabled,textarea:disabled"),
            r = t.find("input,select,textarea");
        if (!(t.is(".fsHidden, .fsHiddenPage") && i.length == r.length && 0 < r.length)) {
            for (var a, n = 0; n < r.length; n++) {
                var o = r[n],
                    s = $(o).parent().is(".fsHiddenByFieldSetting");
                !s && $(o).parent().is(".fsSubField") ? s = $(o).parents(".fsSubFieldGroup").is(".fsHiddenByFieldSetting") : !s && $(o).parent().is(".fsOptionLabel") && (s = $(o).parent().parent().is(".fsHiddenByFieldSetting")), $(o).parent().is(".fsHidden") && !0 === o.disabled || s || ($(o).parent().is(".fsMatrixCol1") || $(o).parent().is(".fsMatrixCol2") ? (s = o.id.indexOf("-"), s = o.id.substring(0, s), s = document.getElementById("matrix-" + s + "-fieldset"), n += $(s).find("input,select,textarea").length - 1, $(s).attr("disabled") && "disabled" == $(s) || $(s).attr("disabled", "disabled"), t.hasClass("fsHidden") || t.addClass("fsHidden")) : (!1 === o.disabled && (o.disabled = !0, this.updateCalculations(this.getFieldId(o)), this.updateDateCalculations(this.getFieldId(o)), this.checkLogic(this.getFieldId(o))), t.hasClass("fsHidden") || (t.addClass("fsHidden"), t.find(".fsFormatLength").each(function(e, t) {
                    this.highlightField(t, !1)
                }.bind(this)))))
            }
            r.length <= 0 && !t.hasClass("fsHidden") && t.addClass("fsHidden"), t.hasClass("fsCell") && (a = t.siblings(".fsCell"), i = t.siblings(".fsCell.fsHidden"), a && i && i.length === a.length && ((a = t.parent()) && a.addClass("fsHidden"))), -1 != this.logicFields.indexOf(e) && this.checkLogic(e)
        }
    }, Formstack.Form.prototype.getCalculation = function(e) {
        for (var t = 0; t < this.calculations.length; t++) {
            var i = this.calculations[t];
            if (0 <= i.fields.indexOf(e)) return i
        }
        return null
    }, Formstack.Form.prototype.getCalculationByTarget = function(e) {
        for (var t = 0; t < this.calculations.length; t++) {
            var i = this.calculations[t];
            if (i.target == e) return i
        }
        return null
    }, Formstack.Form.prototype.updateCalculations = function(e) {
        for (var t = ("object" == typeof e && "target" in e ? this.getFieldId(e.target) : e.toString()), i = 0; i < this.calculations.length; i++) {
            for (var r = this.calculations[i], a = [], n = 0, o = r.fields.length; n < o; n++) {
                var s = r.fields[n].match(/(\d+)/);
                s ? a.push(s[0]) : a.push(r.fields[n])
            }
            0 <= a.indexOf(t) && this.evalCalculation(r)
        }
        this.plugins.discountCode && t == this.plugins.discountCode.total_field && (this.plugins.discountCode.discountClick ? this.plugins.discountCode.discountClick = !1 : this.plugins.discountCode._clearDiscount("re-calculation of total field"))
    }, Formstack.Form.prototype.updateDateCalculations = function(e) {
        for (var t = ("object" == typeof e && "target" in e ? this.getFieldId(e.target) : e.toString()), i = 0, r = this.dateCalculations.length; i < r; i++)
            for (var a = this.dateCalculations[i], n = 0, o = a.fields.length; n < o; n++) {
                var s = "current_date" !== a.fields[n] && a.fields[n].match(/(\d+)/);
                if ((s ? s[0] : a.fields[n]) === t) {
                    this.evalDateCalculation(a);
                    break
                }
            }
    }, Formstack.Form.prototype.evalCalculation = function(calc) {
        for (var equation = calc.equation, unit = "", largestDecimal = 0, length, i, decimals, field, splitEquation = equation.split(" "), i = 0, length = splitEquation.length; i < length; i++) {
            var currentValue = splitEquation[i];
            isFinite(currentValue) && (decimals = this.getDecimals(currentValue), largestDecimal = largestDecimal < decimals ? decimals : largestDecimal)
        }
        for (i = 0, length = calc.fields.length; i < length; i++) {
            var id = calc.fields[i],
                additionalCalc = id.match("-([a-z]+)?");
            additionalCalc && (id = id.substring(0, id.length - additionalCalc[0].length), additionalCalc = additionalCalc[1]);
            for (var regex = new RegExp("\\[" + calc.fields[i] + "\\]", "g"), val = 0, decimals = NaN, fields = this.getFields(id), fLength = fields.length, j = 0; j < fLength; j++) {
                var field = fields[j],
                    properties = this.getNumberProperties(field),
                    calcInfo = this.getCalcInfo(this.getFieldId(field), additionalCalc),
                    val = calcInfo.sum;
                isFinite(val) || (val = 0), decimals = ("number" === field.type ? properties : calcInfo).decimals, val && -1 != val.toString().indexOf("$") && (unit = "$")
            }
            decimals = isNaN(decimals) ? 0 : decimals, equation = equation.replace(regex, val.toFixed(decimals)), largestDecimal = largestDecimal < decimals ? decimals : largestDecimal
        }
        if (field = document.getElementById("field" + calc.target), null !== field) {
            var targetProperties = this.getNumberProperties(field),
                targetDecimals = targetProperties.decimals,
                result = 0,
                old_value;
            "number" !== field.type && (targetDecimals = largestDecimal), targetDecimals = isNaN(targetDecimals) ? 0 : targetDecimals, equation = "(" + equation + ").toFixed(" + targetDecimals + ")";
            try {
                result = eval(equation)
            } catch (e) {}
            isFinite(result) || (result = 0), field = document.getElementById("field" + calc.target), null !== field && (old_value = field.value, $(field).hasClass("fsFormatNumber") ? (field.value = result, this.checkFormat(field)) : field.value = unit + result, jQuery(field).trigger("calceval"), field.value != old_value && (this.checkLogic(calc.target), this.updateCalculations(calc.target), this.updateDateCalculations(calc.target)))
        }
    }, Formstack.Form.prototype.workflowFieldIsAccessible = function(e, t) {
        return !!this.isWorkflowForm && (!((-1 < this.getFieldContainer(e).className.indexOf("fsHidden") || $(e).closest(".fsFieldRow").hasClass("fsHidden")) && !$(e).parent().is(".fsHiddenByFieldSetting")) && "read" === this.getWorkflowStepAccess(t.replace("field", "")))
    }, Formstack.Form.prototype.getDateFieldTimestamp = function(e) {
        var t = document.getElementById(e + "Y"),
            i = document.getElementById(e + "M"),
            r = document.getElementById(e + "D");
        if (t && i && (!t.disabled || this.workflowFieldIsAccessible(t, e))) {
            e = t.options[t.selectedIndex].value, t = i.selectedIndex, i = r ? r.selectedIndex : 1;
            return e && t && (!r || i) ? new Date(e, t - 1, i) : void 0
        }
    }, Formstack.Form.prototype.initDateFieldTimestamp = function(e) {
        e = "current_date" === e ? Formstack.Util.getStartOfCurrentDate() : this.getDateFieldTimestamp("field" + e);
        return e
    }, Formstack.Form.prototype.evalDateCalculation = function(e) {
        var t, i, r, a, n, o;
        
        e 
        
        && 
        
        (
            i = !1,
            (t = document.getElementById("field" + e.target)) || 
            (i = !!(t = document.getElementById("fsCalendar" + e.target + "Link")))
            , 
            r = this.initDateFieldTimestamp(e.fields[0])
            ,
            a = ""
            , 
            t || (i = !!(t = document.getElementById("fsCalendar" + e.target + "Link")))
            ,
            
            r && ("number" === e.type ? 
            
            (n = this.getFields(e.fields[1])[0]) && n.value && !n.disabled && "number" == typeof(o = this.getNumber(n.value)) && (a = this.computeDateDiff(r, o, e, i)) 
            :
            (o = this.initDateFieldTimestamp(e.fields[1])) && (a = this.computeDateDuration(r, o, e.units, e.allowNegatives)))
            , 
            null !== t && 
            (
                o = t.value, i ? this.updateDateFieldValue(e.target, a) : t.value = a
                , 
                jQuery(t).trigger("calceval"), t.value !== o && 
                (this.checkLogic(e.target), this.updateCalculations(e.target), this.updateDateCalculations(e.target))
            )
        
        )
    }, Formstack.Form.prototype.updateDateFieldValue = function(e, t) {
        if (t instanceof Date == !1 || isNaN(t.valueOf()))
            for (var i = ["Y", "M", "D"], r = 0; r < 3; r++) {
                var a = document.getElementById("field" + e + i[r]);
                a && (a.selectedIndex = 0)
            } else {
                var n = "fsCalendar" + e + "Link";
                this.calendarSelect(this.getCalendarFormat(e).replace("yy", t.getFullYear()).replace("mm", t.getMonth() + 1).replace("dd", t.getDate()), {
                    id: n,
                    input: document.getElementById(n)
                })
            }
    }, Formstack.Form.prototype.computeDateDiff = function(e, t, i, r) {
        if (e && "number" == typeof t) {
            var a = "plus" === i.equation ? "+" : "-";
            return (-1 === ((0 < t) - (t < 0) || +t) && (t = Math.abs(t), a = "+" === a ? "-" : "+"), t = this.adjustTimestamp(e, i.units, parseFloat(a + t)), r) ? t : "current_date" === i.fields[0] ? t.getMonth() + 1 + "-" + t.getDate() + "-" + t.getFullYear() : (i = i.fields[0], this.formatDateLikeField(t, i))
        }
    }, Formstack.Form.prototype.updateMonths = function(e, t) {
        var i = e.getMonth() + t,
            t = new Date(e.getFullYear(), i + 1, 0);
        t.setHours(0, 0, 0, 0);
        t = t.getDate();
        e.setMonth(i, Math.min(t, e.getDate()))
    }, Formstack.Form.prototype.adjustTimestamp = function(e, t, i) {
        return "years" === (t = t.toLowerCase()) ? this.updateMonths(e, 12 * i) : "months" == t ? this.updateMonths(e, i) : e.setDate(e.getDate() + i), e
    }, Formstack.Form.prototype.computeDateDuration = function(e, t, i, r) {
        var a, n, o = !1;
        switch (t < e && (a = e, e = t, t = a, o = r), i = i.toLowerCase()) {
            case "years":
                n = this.durationInYears(e, t);
                break;
            case "months":
                n = this.durationInMonths(e, t);
                break;
            default:
                n = this.durationInDays(e, t)
        }
        return o && (n *= -1), n
    }, Formstack.Form.prototype.durationInYears = function(e, t) {
        var i = t.getFullYear() - e.getFullYear(),
            r = t.getMonth() - e.getMonth(),
            t = t.getDate() - e.getDate(),
            e = Math.abs(i);
        return 0 < i && (r < 0 || 0 == r && t < 0) && e--, e
    }, Formstack.Form.prototype.durationInMonths = function(e, t) {
        var i = Math.abs(e.getMonth() - t.getMonth() + 12 * (e.getFullYear() - t.getFullYear()));
        return t.getDate() - e.getDate() < 0 && i--, i
    }, Formstack.Form.prototype.durationInDays = function(e, t) {
        var i = e.getTimezoneOffset() - t.getTimezoneOffset();
        return 0 != i && (t = new Date(t.getTime() + 60 * i * 1e3)), Math.floor(Math.abs((e - t) / 864e5))
    }, Formstack.Form.prototype.formatDateLikeField = function(t, i) {
        var r = this,
            e = this.getDateFieldFormat(i),
            a = new RegExp("(" + ["YY", "Y", "y", "F", "M", "m", "d"].join("|") + ")");
        return e.split(a).map(function(e) {
            switch (e) {
                case "YY":
                case "Y":
                    return t.getFullYear();
                case "y":
                    return t.getFullYear().toString().slice(-2);
                case "F":
                case "M":
                    return r.getDateFieldMonthName(i, t.getMonth() + 1);
                case "m":
                    return ("00" + (t.getMonth() + 1)).slice(-2);
                case "d":
                    return ("00" + t.getDate()).slice(-2)
            }
            return e
        }).join("")
    }, Formstack.Form.prototype.getDateFieldFormat = function(e) {
        return jQuery("#field" + e + "Format").data("dateFormat")
    }, Formstack.Form.prototype.getDateFieldMonthName = function(e, t) {
        return jQuery("#field" + e + "M").children().eq(t).text()
    }, Formstack.Form.prototype.updateProgress = function(e) {
        var t, i, r, a, n = document.getElementById("fsProgress" + this.id);
        n && ((a = $("div.fsPage").length) <= 1 ? n.style.display = "none" : (t = document.getElementById("fsProgressBarContainer" + this.id), i = document.getElementById("fsProgressBar" + this.id), n = 100 * (r = 1 < (r = (r = e / a) < 0 ? 0 : r) ? 1 : r) + "%", $(t).attr("aria-valuenow", Math.floor(100 * r)), a = "Page " + e + " of " + a, $(t).attr("aria-valuetext", a), $(i).css("width", n)))
    }, Formstack.Form.prototype.pageIsVisible = function(e) {
        if ((e = $("#fsPage" + this.id + "-" + e)).hasClass("fsHidden")) return !1;
        for (var t = e.find("div.fsSection"), i = 0; i < t.length; i++) {
            var r = $(t[i]);
            if (!r.hasClass("fsHidden"))
                for (var a = r.find("div.fsCell"), n = 0; n < a.length; n++)
                    if (!$(a[n]).hasClass("fsHidden")) return !0
        }
        return !1
    }, Formstack.Form.prototype.calendarShow = function(e, t) {
        var i = (i = e.id.match(/(\d+)/))[1],
            r = new Date,
            a = document.getElementById("field" + i + "M"),
            n = a && a.selectedIndex ? a.selectedIndex : r.getMonth() + 1,
            a = document.getElementById("field" + i + "D"),
            a = a && a.selectedIndex ? a.selectedIndex : r.getDate(),
            i = document.getElementById("field" + i + "Y"),
            r = r.getFullYear();
        i && i.selectedIndex && (r = parseInt(i.options[i.selectedIndex].value, 10)) < 100 && (r += 2e3);
        i = $(e).datepicker("option", "dateFormat");
        i = (i = (i = i.replace("mm", n)).replace("dd", a)).replace("yy", r), $(e).datepicker("setDate", i)
    }, Formstack.Form.prototype.getHiddenDateFormat = function(e) {
        switch (document.querySelector("#field" + e + "Format").value) {
            case "MDY":
                return "mm/dd/yy";
            case "DMY":
                return "dd/mm/yy";
            case "YMD":
                return "yy/mm/dd";
            default:
                return
        }
    }, Formstack.Form.prototype.calendarSelect = function(e, t) {
        var i = (i = t.id.match(/(\d+)/))[1],
            r = $(t.input).datepicker("option", "dateFormat") || this.getHiddenDateFormat(i),
            a = e.split("/"),
            n = a[2],
            t = a[0],
            e = a[1];
        "dd/mm/yy" == r ? (n = a[2], t = a[1], e = a[0]) : "yy/mm/dd" == r ? (n = a[0], t = a[1], e = a[2]) : "mm/yy/dd" == r && (n = a[1], t = a[0], e = 1);
        a = document.getElementById("field" + i + "M");
        a && (a.selectedIndex = t);
        t = document.getElementById("field" + i + "D");
        t && (t.selectedIndex = e);
        var o = document.getElementById("field" + i + "Y");
        if (o)
            for (var s = 1; s < o.options.length; s++) {
                var l = parseInt(o.options[s].value, 10);
                if (l < 100 && (l += 2e3), l == n) {
                    o.selectedIndex = s;
                    break
                }
            }
        $(o).trigger("change")
    }, Formstack.Form.prototype.textareaCharLimiter = function(e, t) {
        var i = jQuery("#field" + e),
            r = jQuery("#fsCounter" + e),
            a = i.val(),
            n = a.match(/(\r\n|\n|\r)/g),
            e = n ? n.length : 0,
            n = a.length + e;
        r.text(t - n + "/" + t), t < n && i.val(a.substr(0, t - e))
    }, Formstack.Form.prototype.getFields = function(e, t) {
        void 0 === t && (t = !1), e = (e = (e = "string" != typeof e ? String(e) : e).replace("field", "")).replace("[]", "");
        var i = document.getElementsByName("field" + e),
            r = document.getElementsByName("field" + e + "[]"),
            a = document.getElementById("field" + e + "M"),
            n = document.getElementById("field" + e + "H");
        return 0 < (i = i.length <= 0 ? 0 < r.length ? r : t && (a || n) ? $("#fsCell" + e).find("select.fsField") : $(".field" + e + "Subfield") : i).length && null !== document.getElementById("field" + e + "_othervalue") && (n = document.getElementById("field" + e + "_othervalue"), this.forLogic ? i[i.length - 1].value = "Other" : i[i.length - 1].value = n.value), 0 < i.length ? i : document.getElementsByName("field" + e + "[]")
    }, Formstack.Form.prototype.getFieldId = function(e) {
        e = "string" == typeof(e = "object" != typeof e ? e.toString() : e) ? e : e.name.replace("field", "");
        return null === e || null === (e = e.match(/[0-9]+/)) ? "" : e[0]
    }, Formstack.Form.prototype.saveIncomplete = function(e) {
        var t, i = document.getElementById("fsSaveResumePassword" + this.id),
            r = {},
            a = "",
            n = document.getElementById("saveAndResume"),
            o = document.getElementById("saveResumeProcess"),
            n = n && n.innerHTML ? n.innerHTML : "Save and Resume Later",
            o = o && o.innerHTML ? o.innerHTML : "Save and get link";
        r.title = n, r.confirm = o, i ? (a = (t = document.getElementById("resumeConfirmPassword")) && t.innerHTML ? t.innerHTML : "Are you sure you want to leave this form and resume later? If so, please enter a password below to securely save your form.", r.goodies = ["password"]) : a = (t = document.getElementById("resumeConfirm")) && t.innerHTML ? t.innerHTML : "Are you sure you want to leave this form and resume later?", r.message = a, this.launchDialog(r, this.processSaveIncomplete, !1)
    }, Formstack.Form.prototype.addNonce = function() {
        if (!document.getElementById("nonce" + this.id)) {
            for (var e = document.getElementById("fsForm" + this.id), t = "", i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", r = 0; r < 16; r++) t += i.charAt(Math.floor(Math.random() * i.length));
            var a = document.createElement("input");
            a.type = "hidden", a.name = "nonce", a.id = "nonce" + this.id, a.value = t, e.appendChild(a)
        }
    }, Formstack.Form.prototype.processSaveIncomplete = function(e) {
        var t = document.getElementById("fsSaveResumePassword" + this.id),
            i = document.getElementById("fsForm" + this.id);
        if (t) {
            if (e && !e.password) return;
            t = document.getElementById("incomplete_password" + this.id);
            t || ((t = document.createElement("input")).type = "hidden", t.name = "incomplete_password", t.id = "incomplete_password" + this.id, i.appendChild(t)), t.value = e.password
        }
        var r = document.getElementsByTagName("fieldset");
        if (r && 0 < r.length)
            for (var a = 0, n = r.length; a < n; a++) {
                var o = r[a].id.match(/[0-9]+/);
                o && (o = o[0], !document.getElementById("field" + o + "_othervalue") || (o = document.getElementById("field" + o + "_other")) && (o.value = "Other"))
            }
        return document.getElementById("incomplete" + this.id).value = "true", i.submit(), !1
    }, Formstack.Form.prototype.getParameterByName = function(e, t) {
        e = e.replace(/[\[\]]/g, "\\$&");
        t = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
        return t ? t[2] ? decodeURIComponent(t[2].replace(/\+/g, " ")) : "" : null
    }, Formstack.Form.prototype.checkFreeLink = function() {
        var e, t = document.getElementById("fsForm" + this.id);
        if (!$(t).hasClass("fsFormFree")) return !0;
        switch (document.getElementById("referrer_type" + this.id).value) {
            case "iframe":
                e = window.parent.document;
                break;
            case "js":
                e = window.document;
                break;
            default:
                return !0
        }
        for (var i = !1, r = e.getElementsByTagName("a"), a = 0; a < r.length; a++)
            if (0 === r[a].href.indexOf("http://www.formspring.com/") || 0 === r[a].href.indexOf("http://www.formstack.com/")) {
                i = !0;
                break
            } if (i) return !0;
        var n = document.getElementById("embedError"),
            n = n ? n.innerHTML : "There was an error displaying the form. Please copy and paste the embed code again.";
        return this.showError(n), !(t.style.display = "none")
    }, Formstack.Form.prototype.checkMatrixOnePerColumn = function(r) {
        var e = r.split("-"),
            a = e[0],
            n = (e[1], e[2]);
        $("#matrix-" + a + " input").each($.proxy(function(e, t) {
            var i = new RegExp("^" + a + "-\\d+-" + n + "$");
            t.id != r && i.test(t.id) && (t.checked = !1)
        }, this))
    }, Formstack.Form.prototype.onChange = function() {}, Formstack.Form.prototype.getCalcInfo = function(e, t) {
        for (var i = this.getFields(e), r = 0, a = 0, n = 0, o = i.length; n < o; n++) {
            var s = i[n],
                l = 0,
                d = 0;
            if (!s.disabled || this.isWorkflowForm && !this.belongsToHiddenOnlyWorkflowSection(s) && this.isReadOnlyWorkflowInput(s) && !this.belongsToHiddenReadonlyWorkflowSection(s) && !this.hasHiddenParents($(s).attr("id"))) {
                if ("product-quantity" === $(s).attr("data-type")) {
                    var c = $(s),
                        u = c.attr("data-product-price"),
                        m = c.val(),
                        h = this.getNumber(u),
                        c = this.getNumber(m),
                        d = this.getDecimals(u);
                    "price" === t && !isNaN(h) && 0 < h ? r += h : "quantity" === t ? (r += c, d = this.getDecimals(m)) : !isNaN(h) && 0 < h && (r += h * c)
                } else if ("radio" === s.type || "checkbox" === s.type) l = s.checked ? s.value : 0, r += this.getNumber(l), d = this.getDecimals(l);
                else if ("select-multiple" === s.type)
                    for (var f = 0, p = s.options.length; f < p; f++) {
                        var g, y = s.options[f];
                        y.selected && (l = y.value, g = this.getNumber(l), y = this.getDecimals(l), isNaN(g) || (r += g), d = d < y ? y : d)
                    } else d = (l = ("select-one" === s.type ? s.options[s.selectedIndex] : s).value, r += this.getNumber(l), this.getDecimals(l));
                l = 0, a = a < d ? d : a
            }
        }
        return {
            sum: r,
            decimals: a
        }
    }, Formstack.Form.prototype.getNumber = function(e) {
        if ("" === $.trim(e)) return 0;
        var t = parseFloat(e);
        return isNaN(t) ? parseFloat(e.replace(/[^\d\.\-]/g, "")) : t
    }, Formstack.Form.prototype.getDecimals = function(e) {
        var t = (e + "").split("."),
            e = NaN;
        return e = 20 < (e = (e = 2 === t.length ? t[1].length : e) < 0 ? 0 : e) ? 20 : e
    }, Formstack.Form.prototype.emitSubmitMessage = function() {
        this.emitSubmitMessageToWindow(window.parent), this.emitSubmitMessageToWindow(window.opener)
    }, Formstack.Form.prototype.emitSubmitMessageToWindow = function(e) {
        e && e.postMessage && e.postMessage("fs-form-submit", "*")
    }, Formstack.Form.prototype.submit = function(e) {
        if (!this.checkForm()) return !1;
        if (jQuery("#fsCaptcha" + this.id).length && "" === jQuery("#recaptcha_response_field").val()) return jQuery("#fsCaptcha" + this.id).addClass("fsValidationError"), !1;
        this.addNonce();
        var t, i = $("input.fsSubmitButton"),
            i = i.length ? i[0] : null;
        return $(".fsFieldValidating", "#fsForm" + this.id).length ? (i && (t = document.getElementById("validatingText"), i.value = t && t.innerHTML ? t.innerHTML + "..." : "Validating..."), this.skipValidation = !0, setTimeout($.proxy(function() {
            this.form.submit()
        }, this), 100), !1) : !!this.processIntegrations("payment") && (this.skipValidation = !1, this.jsonp ? (this.jsonpSubmit(), !1) : this.customSubmissionHandler ? (this.customSubmissionHandler(), !1) : (this.form.trigger("form:submit"), i && (t = document.getElementById("submittingText"), i.value = t && t.innerHTML ? t.innerHTML + "..." : "Submitting..."), jQuery(".g-recaptcha").length ? (grecaptcha.execute(), !1) : (this.emitSubmitMessage(), !0)))
    }, Formstack.Form.prototype.processIntegrations = function(e) {
        var t = e + "Integrations";
        if ("object" != typeof this[t]) return !0;
        var i, r, a = 0;
        for (i in this[t])
            if (this[t].hasOwnProperty(i)) {
                if ("error" === this[t][i].key) return !1;
                if (!this[t][i].success && void 0 !== this[t][i].success) return !1;
                this[t][i].success || "function" == typeof this[r = "prepare" + i.charAt(0).toUpperCase() + i.slice(1)] && (this[r](), a++)
            } return !a
    }, Formstack.Form.prototype.checkIntegrationsComplete = function(e) {
        var t = e + "Integrations";
        if ("object" == typeof this[t]) {
            for (var i in this[t])
                if (this[t].hasOwnProperty(i) && !this[t][i].success) return;
            "payment" === e && this.form.submit()
        }
    }, Formstack.Form.prototype.checkForm = function() {
        if (this.skipValidation) return !0;
        var e = !0;
        if (this.skipPageValidation) {
            for (var t = !1, i = 1, r = 1, a = this.pages; r <= a; r++)(e = this.checkPage(r)) || t || (t = !0, i = r);
            if (t && this.disableNavigation) return;
            if (t) return void this.changePage(this.currentPage, i)
        } else e = this.checkPage(this.currentPage);
        if (e) {
            var n = [],
                o = $("#fsForm" + this.id + " .fsRequired").get();
            for (r = 0; r < o.length; r++) {
                var s = o[r],
                    l = $(s).parents(".fsMatrixFieldset"),
                    l = void 0 !== l[0] && "disabled" === $(l[0]).attr("disabled");
                (s.disabled || l) && (0 <= s.id.indexOf("_") ? (l = s.id.split("_"), n.push(l[0])) : n.push(s.name))
            }
            return document.getElementById("hidden_fields" + this.id) && (document.getElementById("hidden_fields" + this.id).value = n.join(",")), !0
        }
        return this.form.trigger("form:validation-error"), !1
    }, Formstack.Form.prototype.getWorkflowStepAccess = function(e) {
        e = this.workflowFields[parseInt(e, 10)].section;
        return this.workflowSections[e].workflowAccess
    }, Formstack.Form.prototype.checkLogic = function(e) {
        for (var t = ("object" == typeof e && "target" in e ? this.getFieldId(e.target) : this.getFieldId(e)), i = 0; i < this.checks.length; i++)
            if (!(this.checks[i].fields.indexOf(t) < 0)) {
                var r, a = this.checks[i],
                    n = !1;
                this.forLogic = !0;
                for (var o = 0; o < a.checks.length; o++) {
                    switch ((r = a.checks[o]).condition) {
                        case "dateIsEqual":
                            n = this.isDateEqual(r.field, r.option);
                            break;
                        case "dateIsNotEqual":
                            n = !this.isDateEqual(r.field, r.option);
                            break;
                        case "dateAfter":
                            n = this.isDateAfter(r.field, r.option);
                            break;
                        case "dateBefore":
                            n = this.isDateBefore(r.field, r.option);
                            break;
                        case "dateIsBetween":
                            n = this.isDateBetween(r.field, r.option);
                            break;
                        case "dateIsNotBetween":
                            n = !this.isDateBetween(r.field, r.option);
                            break;
                        case "dateIsWithin":
                            n = this.isDateWithin(r.field, r.option);
                            break;
                        case "dateIsNotWithin":
                            n = !this.isDateWithin(r.field, r.option);
                            break;
                        case "gt":
                            n = this.isFieldGreaterThan(r.field, r.option);
                            break;
                        case "lt":
                            n = this.isFieldLessThan(r.field, r.option);
                            break;
                        case "!=":
                            n = !this.isFieldEqual(r.field, r.option);
                            break;
                        default:
                            n = this.isFieldEqual(r.field, r.option)
                    }
                    if ("AND" == a.bool && !n) break;
                    if ("OR" == a.bool && n) break
                }
                n && "Show" == a.action || !n && "Hide" == a.action ? (this.showFields(a.target), this.fireLogicEvents && this.form.trigger("logic:changed", {
                    target: a.target,
                    type: "show"
                })) : (this.hideFields(a.target), this.fireLogicEvents && this.form.trigger("logic:changed", {
                    target: a.target,
                    type: "hide"
                })), n && "Show" == a.action && this.belongsToHiddenWorkflowSection(r.field) && (this.hideFields(a.target), this.fireLogicEvents && this.form.trigger("logic:changed", {
                    target: a.target,
                    type: "hide"
                }))
            } this.forLogic = !1, this.initializing || this.checkNavigation()
    }, Formstack.Form.prototype.getFieldValues = function(e, t) {
        for (var i = new Array, r = this.getFields(e), a = 0; a < r.length; a++) {
            var n = r[a];
            if (!n.disabled || this.isReadOnlyWorkflowInput(n))
                if ("checkbox" === n.type || "radio" === n.type) n.checked && i.push(n.value);
                else if ("select-multiple" === n.type)
                for (var o = 0; o < n.options.length; o++) n.options[o].selected && i.push(n.options[o].value);
            else "product-quantity" !== $(n).data("type") || 0 !== n.selectedIndex || t ? i.push(n.value) : n.options && n.options.length && "--" === n.options[0].text && i.push("0")
        }
        return i
    }, Formstack.Form.prototype.belongsToHiddenWorkflowSection = function(e) {
        e = $(e).closest(".fsCell");
        return e.hasClass("fsWorkflowHidden") && !e.hasClass("fsWorkflowReadOnly")
    }, Formstack.Form.prototype.belongsToHiddenOnlyWorkflowSection = function(e) {
        return $(e).closest(".fsSection").hasClass("fsHidden")
    }, Formstack.Form.prototype.belongsToHiddenReadonlyWorkflowSection = function(e) {
        e = $(e).closest(".fsSection");
        return e.hasClass("fsHidden") && e.hasClass("fsWorkflowReadOnly")
    }, Formstack.Form.prototype.isReadOnlyWorkflowInput = function(e) {
        e = $(e).closest(".fsCell");
        return !e.hasClass("fsWorkflowHidden") && e.hasClass("fsWorkflowReadOnly")
    }, Formstack.Form.prototype.isFieldEqual = function(e, t) {
        return -1 != this.getFieldValues(e).indexOf(t)
    }, Formstack.Form.prototype.getTimestampFromDefaultDatePattern = function(e) {
        e = e.split("-"), e = new Date(parseInt(e[2], 10), parseInt(e[0], 10) - 1, parseInt(e[1], 10));
        return e.setHours(0, 0, 0, 0), e
    }, Formstack.Form.prototype.isDateAfter = function(e, t) {
        e = this.getDateFieldTimestamp("field" + e);
        if (e) return e.getTime() > this.getTimestampFromDefaultDatePattern(t).getTime()
    }, Formstack.Form.prototype.isDateBefore = function(e, t) {
        e = this.getDateFieldTimestamp("field" + e);
        if (e) return e.getTime() < this.getTimestampFromDefaultDatePattern(t).getTime()
    }, Formstack.Form.prototype.isDateBetween = function(e, t) {
        var i = this.getDateFieldTimestamp("field" + e);
        if (i) {
            var r = t.split(","),
                e = this.getTimestampFromDefaultDatePattern(r[0]).getTime(),
                t = this.getTimestampFromDefaultDatePattern(r[1]).getTime();
            return t < e && (r = e, e = t, t = r), e <= i.getTime() && i.getTime() <= t
        }
    }, Formstack.Form.prototype.isDateWithin = function(e, t) {
        if (e && t) {
            var i = this.getDateFieldTimestamp("field" + e);
            if (i) {
                var r = t.match(/(\d+)\s+(\w+)/);
                if (r && !(r.length < 3)) {
                    var a = parseInt(r[1], 10),
                        e = r[2].toLowerCase(),
                        t = Formstack.Util.getStartOfCurrentDate(),
                        r = 0;
                    return i < t ? r = 1 : t < i && (r = -1), i.setDate(i.getDate() + r), this.computeDateDuration(t, i, e, !1) < a
                }
            }
        }
    }, Formstack.Form.prototype.isDateEqual = function(e, t) {
        if (e && t) {
            e = this.getDateFieldTimestamp("field" + e);
            if (e) return e.getTime() === this.getTimestampFromDefaultDatePattern(t).getTime()
        }
    }, Formstack.Form.prototype.isFieldGreaterThan = function(e, t) {
        var i = this.getFields(e);
        return i && 1 == i.length && "SELECT" == i[0].nodeName ? parseInt(this.getFieldValues(e)[0]) > t : this.getCalcInfo(e).sum > t
    }, Formstack.Form.prototype.isFieldLessThan = function(e, t) {
        var i = this.getFields(e);
        return i && 1 == i.length && "SELECT" == i[0].nodeName ? parseInt(this.getFieldValues(e)[0]) < t : this.getCalcInfo(e).sum < t
    }, Formstack.Form.prototype.hasAlreadyFailedValidation = function(e) {
        var t = !1,
            e = this.getFieldContainer(e);
        return t = -1 != this.failedContainers.indexOf(e) ? !0 : t
    }, Formstack.Form.prototype.checkRequired = function(e, t, i) {
        var r = this.getFieldId(e);
        if (!this.validate || 0 <= location.search.indexOf("no_req")) return !0;
        if (this.fieldManagedByStripe(e) && this.isStripeCCFieldCompleted()) return !0;
        if (null !== t && t && -1 === document.getElementById("fsCell" + r).className.indexOf("fsValidationError")) return !0;
        var a, n, o = !1,
            s = !0;
        if (this.isWorkflowForm && "write" !== this.getWorkflowStepAccess(r)) return !0;
        if (!e.disabled) {
            if ($(e).hasClass("fsRequired")) {
                var l = e.name.substr(0, e.name.indexOf("-")),
                    d = document.getElementById("matrix-" + l),
                    c = $(e).val(),
                    u = "data:image/png;base64,",
                    l = $(e).siblings(".fsSignature");
                if (null !== d) {
                    for (var m = d.getElementsByTagName("input"), h = new Array(!1), f = 0; f < m.length; f++) {
                        var p = !1,
                            g = m[f],
                            y = g.type.toLowerCase();
                        if ("radio" === y || "checkbox" === y) {
                            if ("radio" === y && (p = !0, s = this.checkValidValue(g)), !s && !$(d).hasClass("fsMatrixOnePerColumn")) break;
                            g = parseInt(m[f].id.substr(m[f].id.lastIndexOf("-") + 1)) - 1;
                            null !== h[g] && void 0 !== h[g] || (h[g] = !1), m[f].checked && (h[g] = !0)
                        }
                    }
                    if ($(d).hasClass("fsMatrixOnePerColumn")) {
                        for (s = !0, a = 0, n = h.length; a < n; a++)
                            if (!1 === h[a]) {
                                s = !1;
                                break
                            }
                    } else if (!p)
                        for (s = !1, a = 0, n = h.length; a < n; a++)
                            if (!0 === h[a]) {
                                s = !0;
                                break
                            }
                } else if (null !== c && 0 <= c.indexOf(u) && 0 < l.length) {
                    if (this.isSaveResumeEnabled && 0 <= c.indexOf(u)) return !0;
                    for (var r = e.id.substr(String("field").length), F = $("#signature" + r).jSignature("getData", "native"), s = !1, v = 0, k = F.length; v < k; v++)
                        if (5 <= F[v].x.length) {
                            s = !0;
                            break
                        }
                } else s = this.checkValidValue(e);
                s || (o = !0, $(e).hasClass("fsFieldAddress") && (r = (r = e.id.split("-"))[0]), i || this.failedContainers.push(this.getFieldContainer(e)))
            }
            s && $(e).hasClass("fsUpload") && ((s = this.checkUpload(e)) || (o = !0)), i || this.highlightField(e, !s)
        }
        if (i || !o) return s;
        o = !t, t = document.getElementById("requiredFieldsError") ? document.getElementById("requiredFieldsError").innerHTML : "Please fill in a valid value for all required fields";
        return this.showFieldsError(t, o), !1
    }, Formstack.Form.prototype.showError = function(e, t) {
        $("#fsError" + this.id).remove();
        var i = document.createElement("div");
        i.id = "fsError" + this.id, i.className = "fsError", i.innerHTML = e, i.setAttribute("role", "alert"), i.setAttribute("aria-live", "assertive"), $(i).prependTo("#fsForm" + this.id), t && Formstack.Util.scrollTo("#fsError" + this.id)
    }, Formstack.Form.prototype.showFieldsError = function(e, t) {
        var i = document.getElementById("translatedWord-fields") ? document.getElementById("translatedWord-fields").innerHTML : "Fields",
            i = jQuery(".fsCell.fsValidationError").toArray().reduce(function(e, t, i, r) {
                r = i === r.length - 1 ? "" : ",";
                return e + " <strong>" + jQuery(t).attr("fs-field-validation-name") + r + "</strong>"
            }, " <br/>" + i + ": ");
        return this.showError(e + i, t)
    }, Formstack.Form.prototype.hideError = function() {
        $("#fsError" + this.id).remove()
    }, Formstack.Form.prototype.highlightField = function(e, t, i) {
        var r = this.getFieldContainer(e);
        i = i || "", t ? ($(r).addClass("fsValidationError"), $(e).attr("aria-invalid", !0)) : $(e).hasClass("fsFieldConfirm") || ($(r).removeClass("fsValidationError"), $(e).removeAttr("aria-invalid")), this.hasHtml5Validation && e.setCustomValidity(i), jQuery(".fsValidationError").length || this.hideError()
    }, Formstack.Form.prototype.getContainer = function(e, t) {
        for (var i = e; i && i.tagName && "body" != i.tagName.toLowerCase();) {
            if ($(i).hasClass(t)) return i;
            i = i.parentNode
        }
    }, Formstack.Form.prototype.getFieldContainer = function(e) {
        return this.getContainer(e, "fsFieldCell")
    }, Formstack.Form.prototype.validateNamePart = function(e) {
        e = document.getElementById(e);
        return !$(e).hasClass("fsRequired") || e.value.match(/\S/)
    }, Formstack.Form.prototype.checkValidName = function(e) {
        e = (e = e.id.split("-"))[0];
        return !(!document.getElementById(e + "-first").value.match(/\S/) || !document.getElementById(e + "-last").value.match(/\S/)) && this.validateNamePart(e + "-prefix") && this.validateNamePart(e + "-suffix") && this.validateNamePart(e + "-middle") && this.validateNamePart(e + "-initial")
    }, Formstack.Form.prototype.checkValidValue = function(e) {
        var t = !1,
            i = this.getFieldId(e);
        switch (e.type.toLowerCase()) {
            case "text":
                $(e).hasClass("fsFieldName") ? t = !this.checkValidName(e) : $(e).is(".fsFieldAddress, fsFieldAddress2, .fsFieldCity, .fsFieldState, .fsFieldZip, .fsFieldCountry") ? (i = (i = e.id.split("-"))[0], !(t = !t && document.getElementById(i + "-address") ? !document.getElementById(i + "-address").value.match(/\S/) : t) && document.getElementById(i + "-city") && (t = !document.getElementById(i + "-city").value.match(/\S/)), (r = jQuery("#" + i + "-zip")).length && !r.hasClass("fsFormatZipXX") && (t = t || !r.val().match(/\S/)), r = document.getElementById(i + "-state"), (t = !t && r ? "select-one" == r.type.toLowerCase() ? !r.options[r.selectedIndex].value.match(/\S/) : !r.value.match(/\S/) : t) || (a = document.getElementById(i + "-country")) && !a.options[a.selectedIndex].value.match(/\S/) && (t = !0)) : t = !e.value.match(/\S/);
                break;
            case "textarea":
                t = !e.value.match(/\S/);
                break;
            default:
                var r = this.getFieldValues(e.name, !0),
                    a = this.getFieldContainer(e);
                this.isWorkflowForm && (0 < jQuery(e).parent().find(".fsSignatureValue").length || 0 < jQuery(e).parent().find(".fsFileValue").length) ? t = !1 : "rating" === jQuery(a).attr("fs-field-type") ? jQuery(a).find(".fsRatingNaOption input").prop("checked") || 0 !== r.length && null !== r[0] && "" !== r[0] || (t = !0) : 0 !== r.length && null !== r[0] && "" !== r[0] || (t = !0)
        }
        return !t
    }, Formstack.Form.prototype.checkUpload = function(e) {
        for (var t = !0, i = [], r = e.className.split(/\s+/), a = 0; a < r.length; a++) {
            var n = r[a];
            /^uploadTypes-/.test(n) && (i = n.split("-")[1].split(","))
        }
        for (var o, a = 0; a < i.length; a++) i[a] = i[a].toLowerCase();
        return i.indexOf("*") < 0 && e && "" !== e.value && !e.disabled && ((t = !!((o = e.value.match(/\.(\w+)$/)) && 0 <= i.indexOf(o[1].toLowerCase()))) || (this.highlightField(e, !0), e = document.getElementById("fileTypeAlert") ? $("#fileTypeAlert").text() : "You must upload one of the following file types for the selected field:", alert(e + i.join(", ")))), t
    }, Formstack.Form.prototype.checkFormat = function(e, t, v) {
        var i = "object" == typeof e && "target" in e ? e.target : e,
            e = this.getFieldContainer(i);
        if (this.onChange = !1, void 0 !== t && (this.onChange = !0), this.fieldManagedByStripe(i)) return !0;
        if (("" === i.value || i.disabled) && !this.onChange && -1 === i.className.indexOf("fsFormatMaxDate")) return this.highlightField(i, !1), !0;
        if ("radio" === i.type && !i.checked && !this.onChange) return this.highlightField(i, !1), !0;
        for (var r = i.className.split(/\s+/), a = !1, n = !1, o = 0, s = r.length; o < s; o++)
            if (0 === r[o].indexOf("fsFormat")) {
                var a = !0,
                    l = "check" + r[o].slice(2),
                    d = ["checkFormatPhone"];
                if ("function" == typeof this[l]) {
                    if (!(n = this[l](i, v))) break
                } else {
                    for (var c = 0, u = d.length; c < u; c++)
                        if (0 === l.indexOf(d[c]) && "function" == typeof this[d[c]]) {
                            n = this[d[c]](i);
                            break
                        } if (!n) break
                }
            } var m, t = !a || n;
        return t && a && 0 <= i.className.indexOf("fsRequired") && (e.className.indexOf("fsFieldFocused") < 0 || 0 <= e.className.indexOf("fsValidationError")) && (m = !(t = this.checkRequired(i))), a && (this.highlightField(i, !t), t || m || this.showFieldsError(document.getElementById("invalidFormatError") ? document.getElementById("invalidFormatError").innerHTML : "Please ensure all values are in a proper format.")), t
    }, Formstack.Form.prototype.checkFormatValidateReactField = function(e) {
        var t = "data-validation-message",
            e = $(this.getFieldContainer(e)),
            t = e.find("[" + t + "]").attr(t);
        return e.find(".fsErrorLabel").text(t), "" === t
    }, Formstack.Form.prototype.checkFormatText = function(e) {
        var t, i, r, a, n = null,
            o = !1;
        if (-1 < e.id.indexOf("_confirm") ? (n = e, e = document.getElementById(e.id.replace("_confirm", "")), o = !0) : (n = document.getElementById(e.id + "_confirm"), t = $(e), i = $(n), a = "required", t.hasClass(r = "fsRequired") || (t.val() && i.addClass(r).attr(a, !0), t.val() || i.removeClass(r).removeAttr(a)), n && e.value && n.value && (o = !0)), !(e.value || n && n.value)) return !0;
        if (n && o) {
            if (!n.value) return !1;
            if (n.value != e.value) return !1
        }
        return !0
    }, Formstack.Form.prototype.checkFormatLength = function(e) {
        var t = e.value.length,
            i = parseInt(e.getAttribute("minlength"), 10),
            e = parseInt(e.getAttribute("maxlength"), 10);
        return !(i && t < i) && !(e && e < t)
    }, Formstack.Form.prototype.checkFormatEmail = function(e) {
        var t, i, r, a, n = null,
            o = !1,
            s = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (-1 < e.id.indexOf("_confirm") ? (n = e, e = document.getElementById(e.id.replace("_confirm", "")), o = !0) : (n = document.getElementById(e.id + "_confirm"), t = $(e), i = $(n), a = "required", t.hasClass(r = "fsRequired") || (t.val() && i.addClass(r).attr(a, !0), t.val() || i.removeClass(r).removeAttr(a)), n && e.value && n.value && (o = !0)), !(e.value || n && n.value)) return !0;
        if (n && o) {
            if (!n.value) return !1;
            if (n.value != e.value) return !1;
            if (!n.value.match(s)) return !1
        }
        return e.value.match(s)
    }, Formstack.Form.prototype.checkFormatPhoneExternal = function(e) {
        var t = this.getFieldContainer(e);
        if (!t) return !0;
        if ($(t).hasClass("fsFieldValidating")) return !0;
        var i = $("#fsForm" + this.id).attr("action"),
            r = (this.id, e.value);
        if (!r || "" === r) return !0;
        if ("XX" == ($(e).data("country") || "XX")) return !0;
        i = i.substring(0, i.lastIndexOf("/")) + "/validate.php";
        return $(t).addClass("fsFieldValidating"), $.ajax({
            url: i,
            dataType: "jsonp",
            data: {
                f: this.id,
                field: this.getFieldId(e.id),
                value: e.value
            },
            success: this.onValidationResult.bind(this)
        }), !0
    }, Formstack.Form.prototype.updateConsecutiveDate = function(e, t) {
        var i = "object" == typeof e && "target" in e ? e.target : e
        if (i){
            var i = e.target.id.match(/(\d+)/)[1],
            mydate = this.getDateFieldTimestamp("field" + i),
            field = this.getFieldContainer(e.target);
            if (mydate){
                
                mydate.setDate(mydate.getDate() + 1);
    
                $("div[fs-field-validation-name='" + field.getAttribute("fs-field-validation-name") + " (Day 2)'] input").val(mydate.toLocaleDateString("en-US"));

            }
        }        
    }, Formstack.Form.prototype.updateFormatedRequestedDates = function(e, t){
        var i = "object" == typeof e && "target" in e ? e.target : e
        if (i){
            //get hidden field
            var hiddenFormattedRequestField = document.querySelector("div[fs-field-validation-name='FormattedRequestedDates'] input");
            var uniqueDates = [], consecutiveDates = [];

            $("div[fs-field-validation-name='UniqueDateFields'] textarea").val().split(";").forEach(function(e) {
                var fieldId = $("div[fs-field-validation-name='" + e + "']").get(0).id.match(/(\d+)/)[1],
                mydate = this.getDateFieldTimestamp("field" + fieldId);
                if (mydate && !isNaN(mydate)){
                    uniqueDates.push(mydate.toLocaleDateString("en-US"));
                }
            }, this);

            $("div[fs-field-validation-name='ConsecutiveDateFields'] textarea").val().split(";").forEach(function(e) {
                
                if (!$("div[fs-field-validation-name='" + e + " (Day 2)']").hasClass("fsHidden")){
                    var consecutiveDate = $("div[fs-field-validation-name='" + e + " (Day 2)'] input").val();
                    if (consecutiveDate){
                        consecutiveDates.push(consecutiveDate);
                    }
                }
            }, this);

            var date1, date2, date3;
            date1 = typeof uniqueDates[0] === 'undefined' ? '' : uniqueDates[0];
            date2 = typeof uniqueDates[1] === 'undefined' ? '' : uniqueDates[1];
            date3 = typeof uniqueDates[2] === 'undefined' ? '' : uniqueDates[2];

            if (consecutiveDates.length > 2){
                var consecDate1, consecDate2, consecDate3;
                consecDate1 = typeof consecutiveDates[0] === 'undefined' ? '' : consecutiveDates[0];
                consecDate2 = typeof consecutiveDates[1] === 'undefined' ? '' : consecutiveDates[1];
                consecDate3 = typeof consecutiveDates[2] === 'undefined' ? '' : consecutiveDates[2];

                hiddenFormattedRequestField.value = `${date1} & ${consecDate1}, ${date2} & ${consecDate2} or ${date3} & ${consecDate3}`;

            }
            else{

                hiddenFormattedRequestField.value = `${date1}, ${date2} or ${date3}`;
            }
        }
    }, Formstack.Form.prototype.updateIdealTime = function() {
        var hiddenField = document.querySelector("div[fs-field-validation-name='Mapped Time'] input"),
        hours = timeFields[0].value,
        timeFields = document.querySelectorAll("div[fs-field-validation-name='Ideal Photo Shoot Start Time'] select");
        
        if (hours != null && hours != "" && hours.charAt(0) == '0'){
            hours = hours.substring(1);
        }
        
        var minutes = timeFields[1].value;
        var ampm = timeFields[2].value;
        
        hiddenField.value = hours + ":" + minutes + " " + ampm;
    }, Formstack.Form.prototype.setMinuteOptions = function() {

        var timeFields = document.querySelectorAll("div[fs-field-validation-name='Ideal Photo Shoot Start Time'] select");
    
        var options = timeFields[1].querySelectorAll('option');

        options.forEach(function(option) {
            if (option.value.value != ''){
                
                if (option.value != '' && option.value != '00' && option.value != '15' && option.value != '30' && option.value != '45' ){
                    option.remove();
                }
            }
        });

    }, Formstack.Form.prototype.onValidationResult = function(e) {
        var t, i;
        e && e.success && e.field && ((i = $("#field" + e.field)) && i.length && (t = i[0], (i = this.getFieldContainer(t)) && ($(i).removeClass("fsFieldValidating"), e.valid || this.highlightField(t, !0))))
    }, Formstack.Form.prototype.getPhoneParts = function(e, t) {
        var i = e.toLowerCase().replace(/[^\dx]/g, ""),
            r = "";
        return 0 <= i.indexOf("x") && (i = (e = i.split("x"))[0], r = e[1]), t || "1" == i.charAt(0) && (i = i.slice(1)), [i, r]
    }, Formstack.Form.prototype.checkFormatPhoneUS = function(e) {
        if ("undefined" != typeof googlePhoneParser) return this.checkFormatPhone(e);
        var t = this.getPhoneParts(e.value),
            i = t[0],
            t = t[1];
        return 10 == i.length && (e.value = "(" + i.substr(0, 3) + ") " + i.substr(3, 3) + "-" + i.substr(6, 4), t.length && (e.value += " x" + t), !0)
    }, Formstack.Form.prototype.checkFormatPhoneUK = function(e) {
        if ("undefined" != typeof googlePhoneParser) return this.checkFormatPhone(e);
        var t = this.getPhoneParts(e.value),
            i = t[0],
            t = t[1];
        return "0" == (i = "44" == i.substr(0, 2) && "0" != (i = i.slice(2)).charAt(0) ? "0" + i : i).charAt(0) && (10 == i.length || 11 == i.length) && ("1" == i.charAt(1) && ("1" == i.charAt(2) || "1" == i.charAt(3)) || "8" == i.charAt(1) ? e.value = i.substr(0, 4) + " " + i.substr(4, 3) + " " + i.substr(7, i.length - 7) : "2" == i.charAt(1) || "3" == i.charAt(1) || "5" == i.charAt(1) ? e.value = i.substr(0, 3) + " " + i.substr(3, 4) + " " + i.substr(7, i.length - 7) : e.value = i.substr(0, 5) + " " + i.substr(5, i.length - 5), t.length && (e.value += " x" + t), !0)
    }, Formstack.Form.prototype.checkFormatPhoneAU = function(e) {
        if ("undefined" != typeof googlePhoneParser) return this.checkFormatPhone(e);
        var t = this.getPhoneParts(e.value, !0),
            i = !0,
            r = t[0],
            a = t[1];
        9 === (r = "61" === r.substr(0, 2) ? r.slice(2) : r).length && (r = "0" + r);
        for (var n = ["0", "13", "1300", "18", "1800"], o = !1, s = 0, l = n.length; s < l; s++)
            if (r.substr(0, n[s].length) === n[s]) {
                o = !0, "0" !== n[s] && (i = !1);
                break
            } if (!o) return !1;
        if (-1 === [6, 10].indexOf(r.length)) return !1;
        t = "", t = i ? "(" + r.substr(0, 2) + ") " + r.substr(2, 4) + " " + r.substr(6, 4) : 6 === r.length ? r.substr(0, 2) + " " + r.substr(2, 2) + " " + r.substr(4, 2) : r.substr(0, 4) + " " + r.substr(4, 3) + " " + r.substr(7, 3);
        return a.length && (t += " x" + a), e.value = t, !0
    }, Formstack.Form.prototype.checkFormatPhoneXX = function(e) {
        return "undefined" != typeof googlePhoneParser ? this.checkFormatPhone(e) : /\d{3,}/.test(e.value)
    }, Formstack.Form.prototype.checkFormatPhone = function(e) {
        if ("undefined" == typeof googlePhoneParser) return this.checkFormatPhoneXX(e);
        var t = $(e).data("country") || "XX";
        if ("XX" == t) return /\d{3,}/.test(e.value);
        var i = googlePhoneParser(e.value, t = "UK" == t ? "GB" : t);
        if (!i || !i.valid) return !1;
        t = $(e).data("format") || "national";
        return e.value = i[t] || e.value, !0
    }, Formstack.Form.prototype.checkFormatZipUS = function(e) {
        var t = e.value.replace(/^\s+/, "").replace(/\s+$/, "");
        return !!t.match(/^\d{5}(?:\-\d{4})?$/) && (e.value = t, !0)
    }, Formstack.Form.prototype.checkFormatZipXX = function(e) {
        return !0
    }, Formstack.Form.prototype.checkFormatZipCA = function(e) {
        var t = e.value.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s{2,}/, " ").toUpperCase();
        return !!(t = 6 == t.length && !t.match(/\s/) ? t.substr(0, 3) + " " + t.substr(3, 3) : t).match(/^[A-Z]\d[A-Z] \d[A-Z]\d$/) && (e.value = t, !0)
    }, Formstack.Form.prototype.checkFormatZipUK = function(e) {
        var t = e.value.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s{2,}/, " ").toUpperCase();
        return !!(t = !t.match(/\s/) ? t.substr(0, t.length - 3) + " " + t.substr(t.length - 3, 3) : t).match(/^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/) && (e.value = t, !0)
    }, Formstack.Form.prototype.checkFormatZipAU = function(e) {
        var t = e.value.replace(/^\s+/, "").replace(/\s+$/, "").toUpperCase();
        return !!t.match(/^\d{4}$/) && (e.value = t, !0)
    }, Formstack.Form.prototype.checkFormatMaxDate = function(e) {
        var t = e.id.slice(0, -1),
            i = document.getElementById(t + "Y"),
            r = document.getElementById(t + "M"),
            a = document.getElementById(t + "D"),
            n = i.options[i.selectedIndex].value,
            o = r.selectedIndex,
            s = a ? a.selectedIndex : 1,
            l = document.getElementById(t + "MaxDate").value,
            i = -1 < e.className.indexOf("fsRequired"),
            r = !n && !o && a && !s,
            t = !1;
        return (-1 < this.getFieldContainer(e).className.indexOf("fsHidden") || $(e).closest(".fsSection").hasClass("fsHidden")) && (t = !0), 2 === n.length && (n = "20" + n), !!(r && !i || t) || !(!n || !o || a && !s) && new Date(n, o - 1, s) <= new Date(l.replace(/-/g, "/"))
    }, Formstack.Form.prototype.checkFormatMinDate = function (e) {
        var t = e.id.slice(0, -1),
            i = document.getElementById(t + "Y"),
            r = document.getElementById(t + "M"),
            a = document.getElementById(t + "D"),
            n = i.options[i.selectedIndex].value,
            o = r.selectedIndex,
            s = a ? a.selectedIndex : 1,
            //l = document.querySelector("div[fs-field-validation-name='MinDate'] input").value,
            //l = document.getElementById(t + "MinDate").value,
            i = -1 < e.className.indexOf("fsRequired"),
            r = !n && !o && a && !s,
            t = !1;
        return (-1 < this.getFieldContainer(e).className.indexOf("fsHidden") || $(e).closest(".fsSection").hasClass("fsHidden")) 
            && (t = !0)
            , 
            //if year is 2 digit make it 4
            2 === n.length && (n = "20" + n)
            , 
    
            
            !!(r && !i || t) || !(!n || !o || a && !s) 
            && 
            new Date(n, o - 1, s) >= this.determineMinDate()
        }, Formstack.Form.prototype.checkFormatBlackOutDates = function (e) {
        var t = e.id.slice(0, -1),
            i = document.getElementById(t + "Y"),
            r = document.getElementById(t + "M"),
            a = document.getElementById(t + "D"),
            n = i.options[i.selectedIndex].value,
            o = r.selectedIndex,
            s = a ? a.selectedIndex : 1,
            l = document.querySelector("div[fs-field-validation-name='BlackOutDates'] textarea").value,
            //l = document.getElementById(t + "MinDate").value,
            i = -1 < e.className.indexOf("fsRequired"),
            r = !n && !o && a && !s,
            t = !1;
        return (-1 < this.getFieldContainer(e).className.indexOf("fsHidden") || $(e).closest(".fsSection").hasClass("fsHidden")) 
            && (t = !0)
            , 
            //if year is 2 digit make it 4
            2 === n.length && (n = "20" + n)
            , 
    
            
            !!(r && !i || t) || !(!n || !o || a && !s) 
            && 
            $.inArray(""+o+"/"+s+"/"+n, l.split(";")) == -1
            //new Date(n, o - 1, s) >= new Date(l.replace(/-/g, "/"))
        }, 
        // Formstack.Form.prototype.getDateFromFieldId = function (e) {
        //     var i = document.getElementById("field" + e + "Y"),
        //         r = document.getElementById("field" + e + "M"),
        //         a = document.getElementById("field" + e + "D"),
        //         n = i.options[i.selectedIndex].value,
        //         o = r.selectedIndex,
        //         s = a ? a.selectedIndex : 1,
        //         r = !n && !o && a && !s,
        //         t = !1;
        //         if (2 === n.length){
        //             n = "20" + n
        //         }                
        //         if(!!(r && !i || t) || !(!n || !o || a && !s) ){
        //             return new Date(n, o - 1, s)
        //         } 
        //         return null
        // }
        
        
        // , 
        Formstack.Form.prototype.checkFormatUniqueDates = function (e, state) {

            // get current date field id
            var t = e.id.slice(0, -1),
            i = document.getElementById(t + "Y"),
            r = document.getElementById(t + "M"),
            a = document.getElementById(t + "D"),
            n = i.options[i.selectedIndex].value,
            o = r.selectedIndex,
            s = a ? a.selectedIndex : 1,
            uniqueDateFieldsArray = document.querySelector("div[fs-field-validation-name='UniqueDateFields'] textarea").value.split(";"),
            currentFieldName = this.getContainer(e, "fsCell").getAttribute("fs-field-validation-name"),
            
            fieldNameIndex = uniqueDateFieldsArray.indexOf(currentFieldName),
            //l = document.getElementById(t + "MinDate").value,
            i = -1 < e.className.indexOf("fsRequired"),
            r = !n && !o && a && !s,
            uniqueDates = [],
            t = !1;

            if (!!(r && !i || t) || !(!n || !o || a && !s) && fieldNameIndex > -1){
                
                uniqueDateFieldsArray.splice(fieldNameIndex, 1);

                uniqueDateFieldsArray.forEach(function(x){
                    
                    var fieldId = document.querySelector("div[fs-field-validation-name='" + x + "']").id.match(/(\d+)/)[1];
                    
                    if (state){
                        if(this.getDateFieldTimestamp("field" + fieldId)){
                            $("#field" + fieldId + "Y").trigger("change", [!0, !1]);           
                        }
                    }


                    
                    var theDate = new Date();
                    // = this.getDateFromFieldId(fieldId);

                    var j = document.getElementById("field" + fieldId + "Y"),
                    p = document.getElementById("field" + fieldId + "M"),
                    k = document.getElementById("field" + fieldId + "D"),
                    h = j.options[j.selectedIndex].value,
                    q = p.selectedIndex,
                    v = k ? k.selectedIndex : 1,
                    p = !h && !q && k && !v,
                    t = !1;
                    if (2 === h.length){
                        h = "20" + h
                    }
                    
                    if(!!(p && !j || t) || !(!h || !q || k && !v) ){
                        theDate = new Date(h, q - 1, v).getTime()
                    } else {

                        theDate = null
                    } 
                    if (theDate){
                        uniqueDates.push(theDate);
                    }                    
                }, this);

            }
                
            return (-1 < this.getFieldContainer(e).className.indexOf("fsHidden") || $(e).closest(".fsSection").hasClass("fsHidden")) 
                && (t = !0)
                , 
                //if year is 2 digit make it 4
                2 === n.length && (n = "20" + n)
                , 
        
                
                !!(r && !i || t) || !(!n || !o || a && !s) 
                && 
                $.inArray(new Date(n, o - 1, s).getTime(), uniqueDates) == -1
                //new Date(n, o - 1, s) >= new Date(l.replace(/-/g, "/"))
        },

        Formstack.Form.prototype.checkFormatConsecutiveDates = function(e) {

            var t = e.id.slice(0, -1),
            i = document.getElementById(t + "Y"),
            r = document.getElementById(t + "M"),
            a = document.getElementById(t + "D"),
            n = i.options[i.selectedIndex].value,
            o = r.selectedIndex,
            s = a ? a.selectedIndex : 1,
            consecutiveDateFieldsArray = document.querySelector("div[fs-field-validation-name='ConsecutiveDateFields'] textarea").value.split(";"),            
            consecutiveDates = [],
            i = -1 < e.className.indexOf("fsRequired"),
            r = !n && !o && a && !s,
            t = !1;
            if (!!(r && !i || t) || !(!n || !o || a && !s)) {

                consecutiveDateFieldsArray.forEach(function(x){
                    var consecutiveDateField = document.querySelector("div[fs-field-validation-name='" + x + " (Day 2)']"),
                    consecutiveDateFieldValue = document.querySelector("div[fs-field-validation-name='" + x + " (Day 2)'] input"),  
                    consecutiveDate;
                    
                    if (consecutiveDateField && -1 == consecutiveDateField.className.indexOf("fsHidden")){
                        
                        if (consecutiveDateFieldValue && consecutiveDateFieldValue.value){
                            consecutiveDate = new Date(consecutiveDateFieldValue.value).getTime()
                        } else {
                            consecutiveDate = null
                        } 
                        if (consecutiveDate){
                            consecutiveDates.push(consecutiveDate);
                        }     
                    }
                });
            }
            return (-1 < this.getFieldContainer(e).className.indexOf("fsHidden") || $(e).closest(".fsSection").hasClass("fsHidden")) 
                && (t = !0)
                , 
                //if year is 2 digit make it 4
                2 === n.length && (n = "20" + n)
                , 
        
                
                !!(r && !i || t) || !(!n || !o || a && !s) 
                && 
                $.inArray(new Date(n, o - 1, s).getTime(), consecutiveDates) == -1
        },

        Formstack.Form.prototype.checkDisabledDates = function(e) {

            var l = document.querySelector("div[fs-field-validation-name='BlackOutDates'] textarea").value.split(";"),
            uniqueDateFieldsArray = document.querySelector("div[fs-field-validation-name='UniqueDateFields'] textarea").value.split(";"),
            disabledDates = [];
            l.forEach(function(e) {
                disabledDates.push(new Date(e).getTime());
            });
            uniqueDateFieldsArray.forEach(function(x){
                var fieldId = document.querySelector("div[fs-field-validation-name='" + x + "']").id.match(/(\d+)/)[1],
                consecutiveDateField = document.querySelector("div[fs-field-validation-name='" + x + " (Day 2)']"),     
                consecutiveDateFieldValue = document.querySelector("div[fs-field-validation-name='" + x + " (Day 2)'] input"),             
                theDate = new Date(),
                consecutiveDate;
                // = this.getDateFromFieldId(fieldId);

                var j = document.getElementById("field" + fieldId + "Y"),                
                p = document.getElementById("field" + fieldId + "M"),                
                k = document.getElementById("field" + fieldId + "D"),
                h = j.options[j.selectedIndex].value,
                q = p.selectedIndex,
                v = k ? k.selectedIndex : 1,
                p = !h && !q && k && !v,
                t = !1;
                if (2 === h.length){
                    h = "20" + h
                }                
                if(!!(p && !j || t) || !(!h || !q || k && !v) ){
                    theDate = new Date(h, q - 1, v).getTime()
                } else {

                    theDate = null
                } 
                if (theDate){
                    disabledDates.push(theDate);
                }     
                
                if (consecutiveDateField && -1 == consecutiveDateField.className.indexOf("fsHidden")){
                    
                    if (consecutiveDateFieldValue && consecutiveDateFieldValue.value){
                        consecutiveDate = new Date(consecutiveDateFieldValue.value).getTime()
                    } else {
                        consecutiveDate = null
                    } 
                    if (consecutiveDate){
                        disabledDates.push(consecutiveDate);
                    }     
                }
                
            });
            //var dateString = $.datepicker.formatDate('m/d/yy', myDate);
            return [disabledDates.indexOf(e.getTime()) == -1, ""];
                    
        },
        
        Formstack.Form.prototype.checkFormatNumber = function(e) {
        var t, i, r = e.value.replace(/[^\d\.\-]/g, ""),
            a = this.getNumberProperties(e),
            n = [],
            o = r.split(".");
        o[0] && (n = o[0].match(/.{1,16}/g)), o[1] && (n.length ? (i = (t = n).pop(), i += "." + o[1], n[n.length - 1] = t.join("")) : i = "." + o[1], i = i.match(/.{1,16}/g), n.push(i[0]));
        for (var s = 0, l = n.length; s < l; s++)
            if ("-" !== n[[s]] && isNaN(n[s])) return !1;
        if (!isNaN(a.min) && r < a.min || !isNaN(a.max) && r > a.max) return !1;
        var d = "";
        if (isNaN(a.decimals)) d = r;
        else
            for (s = 0, l = n.length; s < l; s++) d += s < l - 1 ? n[s] : parseFloat(n[s]).toFixed(a.decimals) + "";
        return e.value = d, !0
    }, Formstack.Form.prototype.checkFormatCreditCard = function(e) {
        for (var t = e.value.replace(/\D/g, ""), i = 0, r = 1, a = (e.value = t).length - 1; 0 <= a; a--) {
            var n = parseInt(t.charAt(a)) * r;
            i += 9 < n ? n - 9 : n, r = 1 == r ? 2 : 1
        }
        return i % 10 == 0 && (t.match(/^4/) ? $(e).hasClass("fsAcceptVisa") && (13 == t.length || 16 == t.length) : t.match(/^(?:51|52|53|54|55)/) ? $(e).hasClass("fsAcceptMasterCard") && 16 == t.length : t.match(/^(?:6011|622|64|65)/) ? $(e).hasClass("fsAcceptDiscover") && 16 == t.length : t.match(/^(?:34|37)/) ? $(e).hasClass("fsAcceptAmex") && 15 == t.length : t.match(/^(?:300|301|302|303|304|305|36|54|55)/) ? $(e).hasClass("fsAcceptDiners") && (14 == t.length || 16 == t.length) : !!t.match(/^35/) && ($(e).hasClass("fsAcceptJCB") && 16 == t.length))
    }, Formstack.Form.prototype.getNumberProperties = function(e) {
        for (var t, i = {
                min: NaN,
                max: NaN,
                decimals: NaN,
                currency: null,
                currencySymbol: null,
                currencyPrefix: null,
                currencySuffix: null
            }, r = e.className.split(/\s+/), a = 0; a < r.length; a++) {
            var n, o = r[a];
            (n = o.match(/^fsNumberMin-([\-\d.]+)/)) ? i.min = parseFloat(n[1]): (n = o.match(/^fsNumberMax-([\-\d.]+)/)) ? i.max = parseFloat(n[1]) : (n = o.match(/^fsNumberDecimals-([\d]+)/)) ? i.decimals = parseInt(n[1]) : (n = o.match(/^fsNumberCurrency-([A-Z]+)/i)) && (i.currency = n[1])
        }
        return i.currency && ((t = document.getElementById(e.id + "CurrencyPrefix")) && (i.currencyPrefix = t.innerHTML), (e = document.getElementById(e.id + "CurrencySuffix")) && (i.currencySuffix = e.innerHTML), "dollar" === i.currency ? i.currencySymbol = "$" : "euro" === i.currency ? i.currencySymbol = "&euro;" : "pound" === i.currency ? i.currencySymbol = "&pound;" : "yen" === i.currency ? i.currencySymbol = "&#165;" : "baht" === i.currency ? i.currencySymbol = "&#x0E3F;" : "ils" === i.currency ? i.currencySymbol = "&#x20AA;" : "krone" === i.currency ? i.currencySymbol = "kr" : "lira" === i.currency ? i.currencySymbol = "&#x20BA;" : "ruble" === i.currency ? i.currencySymbol = "&#x20BD;" : "yuan" === i.currency ? i.currencySymbol = "&#x5143;" : "zloty" === i.currency && (i.currencySymbol = "z&#x0142;")), i
    }, Formstack.Form.prototype.generatePrePopulateLink = function() {
        var e = document.location.href;
        (e = e.replace("&admin_tools", "")).indexOf("?") < 0 && (e += "?");
        for (var t = $(".fsField"), i = 0; i < t.length; i++) {
            var r, a = t[i];
            $(a).hasClass("fsFormatCreditCard") || null !== (r = this.getValue(a)) && "" !== r && (name = null !== a.name ? a.name : a.id, e += "&" + name + "=" + encodeURIComponent(r))
        }
        document.getElementById("form" + this.id + "PrePopulateLink").value = e, document.getElementById("form" + this.id + "PrePopulateDiv").style.display = "block"
    }, Formstack.Form.prototype.getValue = function(e) {
        return e.disabled ? null : "radio" == e.type || "checkbox" == e.type ? e.checked ? e.value : null : ("select-one" == e.type ? e.options[e.selectedIndex] : e).value
    }, Formstack.Form.prototype.setValue = function(e, t) {
        var i = this.getFields(e, !0),
            r = t.split("\n"),
            a = null,
            n = document.getElementById("fsCalendar" + e),
            o = document.getElementById("field" + e + "H");
        if (!n && !o || $.isNumeric(t) || (a = new Date(t), isNaN(a.getTime()) && (a = null)), 0 === i.length)
            for (var s, l, d = 0; d < r.length; d++) 0 < (m = r[d]).indexOf(" = ") && (s = m.split(" = "), null !== (l = document.getElementById("field" + e + "-" + s[0])) && (l.value = s[1]));
        else
            for (d = 0; d < i.length; d++) {
                var c = i[d];
                if ("file" !== c.type && !jQuery("#signature" + e).length)
                    if ("radio" == c.type || "checkbox" == c.type)
                        if (1 < r.length)
                            for (var u = 0; u < r.length; u++)(m = r[u].split(" | "))[0] == c.value && (c.checked = !0);
                        else c.value == r[0] && (c.checked = !0);
                else if ("select-multiple" == c.type || "select-one" == c.type)
                    if (1 < r.length)
                        for (u = 0; u < r.length; u++)
                            for (var m, h = 0; h < c.options.length; h++)(m = r[u].split(" | "))[0] == c.options[h].value && (c.options[h].selected = !0);
                    else if (null !== a) {
                    var f = "field" + e,
                        p = c.id.substring(f.length),
                        g = c.options,
                        y = g[g.length - 1].value,
                        F = null,
                        t = null;
                    switch (p) {
                        case "M":
                            F = a.getMonth() + 1;
                            break;
                        case "D":
                            F = a.getDate();
                            break;
                        case "Y":
                            var v = a.getFullYear(),
                                k = new String(y);
                            4 === k.length ? t = v : 2 === k.length && (t = new String(v).substring(2));
                            break;
                        case "H":
                            var b = 13 < c.length,
                                C = a.getHours(),
                                t = C,
                                k = "am",
                                v = document.getElementById(f + "A");
                            b || (12 < t ? (t = C - 12, k = "pm") : 0 === t ? t = 12 : 12 === t && (k = "pm"), v && ("am" === k ? v.options[1].selected = !0 : "pm" === k && (v.options[2].selected = !0)));
                            break;
                        case "I":
                            F = a.getMinutes() + 1;
                            break;
                        case "S":
                            F = a.getSeconds() + 1
                    }
                    if (null !== F) g[F].selected = !0;
                    else if (null !== t)
                        for (u = 0; u < c.options.length; u++) t == c.options[u].value && (c.options[u].selected = !0)
                } else
                    for (u = 0; u < c.options.length; u++) r[0] == c.options[u].value && (c.options[u].selected = !0);
                else c.value = t
            }
    }, Formstack.Form.prototype.setFieldValue = function(e, t, i) {
        null !== e && ("radio" === e.type || "checkbox" === e.type ? e.checked = i : e.value = t, $(e).trigger("change"))
    }, Formstack.Form.prototype.prefill = function(e) {
        for (var t = 0; t < e.length; t++) this.setValue(e[t].id, e[t].value)
    }, Formstack.Form.prototype.copyFieldValue = function(e, t) {
        for (var i = $(".fsField"), r = 0; r < i.length; r++) {
            var a, n = i[r]; - 1 < n.id.indexOf("field" + e) && (a = n.id.replace("field" + e, ""), a = document.getElementById("field" + t) || document.getElementById("field" + t + a), this.setFieldValue(a, n.value, n.checked))
        }
    }, Formstack.Form.prototype.determineLocation = function() {
        if (navigator.geolocation) try {
            navigator.geolocation.watchPosition(function(e) {
                $('input[name="latitude"]').val(e.coords.latitude), $('input[name="longitude"]').val(e.coords.longitude)
            }, function(e) {}, {
                enableHighAccuracy: !0,
                maximumAge: 6e4,
                timeout: 1e4
            })
        } catch (e) {}
    }, Formstack.Form.prototype.toggleValidation = function(e) {
        this.validate ? (this.validate = !1, $(e).html("Turn On Validation"), document.getElementById("fsSubmitButton" + this.id).disabled = !0) : (this.validate = !0, $(e).html("Turn Off Validation"), document.getElementById("fsSubmitButton" + this.id).disabled = !1)
    }, Formstack.Form.prototype.onPostSubmit = function(e) {
        null !== e.message && "" !== e.message || (e.message = "Thank You!");
        var t = '<div align="center" style="font-size:16px;font-weight:bold;padding:25px;">';
        t += e.message, t += "</div><br />", $("#fsForm" + this.id).html(t), this.emitSubmitMessage()
    }, Formstack.Form.prototype.onSubmitError = function(e) {
        e.error && this.showError(e.error)
    }, Formstack.Form.prototype.focusFirstError = function() {
        var e, t, i = $(".fsValidationError").first();
        i && ((e = i.find('[aria-invalid="true"]').first()) ? setTimeout(function() {
            e.focus()
        }, 1) : (t = $(i).attr("id").replace("fsCell", ""), setTimeout(function() {
            $("#field" + t).focus()
        }, 1)))
    }, Formstack.Form.prototype.jsonpSubmit = function() {
        if (jQuery(".g-recaptcha").length) return grecaptcha.execute(), !1;
        var e = document.getElementById("fsForm" + this.id),
            t = (this.id, document.createElement("script"));
        return t.src = e.action + "?jsonp&" + $(e).serialize() + "&nocache=" + (new Date).getTime(), e.parentNode.insertBefore(t, e), !1
    }, Formstack.Form.prototype.jsonpRecaptchaSubmit = function(e) {
        var t = document.getElementById("fsForm" + e.id),
            e = (e.id, document.createElement("script"));
        return e.src = t.action + "?jsonp&" + $(t).serialize() + "&nocache=" + (new Date).getTime(), t.parentNode.insertBefore(e, t), !1
    }, Formstack.Form.prototype.changePage = function(e, t) {
        var i = "fsPage" + this.id + "-",
            r = document.getElementById(i + e),
            a = document.getElementById(i + t),
            n = null;
        e < t ? n = "forward" : t < e && (n = "reverse"), this.currentPage = t, this.updateProgress(this.currentPage), this.currentPage == this.pages || this.isLastPage(this.currentPage) ? (null !== this.plugins.confirmationPage && void 0 !== this.plugins.confirmationPage && this.plugins.confirmationPage.parsePage(), $("#fsCaptcha" + this.id).show(), $("#fsSubmitButton" + this.id).show(), $("#fsNextButton" + this.id).hide()) : 1 == this.currentPage ? $("#fsPreviousButton" + this.id).hide() : $("#fsSaveIncomplete" + this.id).show(), "reverse" === n && ($("#fsCaptcha" + this.id).hide(), $("#fsSubmitButton" + this.id).hide());
        var o = this;
        this.disableNavigation = !0, $(r).fadeOut(200, function() {
            if (o.disableNavigation = !1, $(r).addClass("fsHiddenPage"), o.skipPageValidation && "forward" !== n || $(".fsError").hide(), "reverse" === n ? $("#fsNextButton" + o.id).show() : "forward" === n && $("#fsPreviousButton" + o.id).show(), $(a).removeClass("fsHiddenPage"), $(a).show(), "forward" === n)
                for (var e, t = $(a).find(".fsSignature"), i = 0; i < t.length; i++) o.isSurvey() ? ($(t[i]).empty(), $(t[i]).jSignature({
                    sizeRatio: o.getJSignatureRatio()
                })) : o.isSaveResumeEnabled ? (e = o.getSignatureImageData(t[i].id), $(t[i]).empty(), e ? ($(t[i]).jSignature(), $(t[i]).jSignature("setData", e)) : $(t[i]).jSignature()) : $(t[i]).height() <= 40 && ($(t[i]).empty(), $(t[i]).jSignature());
            "reverse" === n ? o.form.trigger("form:prev-page", o.currentPage) : "forward" === n && o.form.trigger("form:next-page", o.currentPage), document.activeElement.blur(), $(a).find("input,textarea,select,button").filter(":visible:enabled:not([readonly])").first().focus(), Formstack.Util.scrollTo($(a))
        })
    }, Formstack.Form.prototype.isTouchable = function(e) {
        var t = " -webkit- -moz- -o- -ms- ".split(" ");
        if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch) return !0;
        t = ["(", t.join("touch-enabled),("), "heartz", ")"].join("");
        return window.matchMedia(t).matches
    }, Formstack.Form.prototype.getIncompleteFields = function(e) {
        var t = "#fsForm" + this.id + " .fsField";
        !0 === e && (t += ".fsRequired");
        for (var i, r = $(t += ":not([disabled])"), a = [], n = r.length, o = 0; o < n; o++) this.checkRequired(r[o], !1, !0) || (i = this.getFieldId(r[o].id), a.push({
            id: i,
            field: r[o]
        }));
        return a
    }, Formstack.Form.prototype.enableLogicEvents = function() {
        this.fireLogicEvents = !0
    }, Formstack.Form.prototype.launchDialog = function(n, o, s) {
        var e, t, i, l = document.querySelector(".fs-form-dialog");
        if (!l) return (h = (n.goodies ? prompt : confirm)(n.message)) ? (n.goodies && (m = h, (h = {})[n.goodies[0]] = m), void o.apply(this, [h])) : void 0;
        if (n.goodies && n.goodies.length)
            for (var r = 0, a = n.goodies.length; r < a; r++) {
                var d = l.querySelector(".fs-form-dialog__" + n.goodies[r]);
                d.className = d.className.replace(" fs-form-dialog--hidden", "")
            }
        for (e in n) n.hasOwnProperty(e) && "goodies" !== e && (i = l.querySelector(".fs-form-dialog__" + e)) && ("cancel" === e || "confirm" === e ? (i.setAttribute("title", n[e]), (t = i.querySelector(".fs-form-dialog__button-text")) && (t.innerHTML = n[e])) : i.innerHTML = n[e]);
        var c = function(e) {
                e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
                var t = {};
                if (n.goodies && n.goodies.length)
                    for (var i = 0, r = n.goodies.length; i < r; i++) {
                        var a = l.querySelector(".fs-form-dialog__" + n.goodies[i]);
                        t[n.goodies[i]] = a.value
                    }
                o.apply(this, [t]), s && u()
            }.bind(this),
            u = function(e) {
                e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), this.closeDialog(n.goodies, u, c)
            }.bind(this),
            m = l.querySelector(".fs-form-dialog__cancel"),
            h = l.querySelector(".fs-form-dialog__confirm");
        Formstack.Util.addEvent("click", m, u), Formstack.Util.addEvent("click", h, c), l.className = l.className.replace(" fs-form-dialog--hidden", "")
    }, Formstack.Form.prototype.closeDialog = function(i, e, t) {
        var r, a, n = document.querySelector(".fs-form-dialog");
        n && (n.className += " fs-ngdialog-closing", setTimeout(function() {
            if (n.className.match("fs-form-dialog--hidden") || (n.className += " fs-form-dialog--hidden"), n.className = n.className.replace(" fs-ngdialog-closing", ""), i && i.length)
                for (var e = 0, t = i.length; e < t; e++) n.querySelector(".fs-form-dialog__" + i[e]).className += " fs-form-dialog--hidden"
        }, 550), r = n.querySelector(".fs-form-dialog__cancel"), a = n.querySelector(".fs-form-dialog__confirm"), Formstack.Util.removeEvent("click", r, e), Formstack.Util.removeEvent("click", a, t))
    }, Formstack.IOS = {}, Formstack.IOS.getRectById = function(e) {
        e = document.getElementById(e);
        if (e) {
            e = e.getBoundingClientRect();
            return "{{" + e.left + "," + e.top + "}, {" + e.width + "," + e.height + "}}"
        }
        return null
    }, Formstack.IOS.base64EncodedUpload = function(e, t) {
        var i = document.getElementById("field" + e),
            r = document.getElementById("field" + e + "-ios-button");
        return i ? (r && (r.innerHTML = "Change file"), i.value = t, document.getElementById("field" + e + "Preview").src = "data:image/jpeg;base64," + t, 1) : 0
    }, Formstack.IOS.fileUpload = function(e) {
        window.location = "ios://fileupload/" + e
    }, Formstack.IOS.scanCreditCard = function(e) {
        window.location = "ios://scancreditcard/" + e
    }, Formstack.IOS.onCreditCard = function(e, t) {
        e = document.getElementById("field" + e);
        if (!e) return !1;
        e.value = t
    }, Formstack.Android = {}, Formstack.Android.scanCreditCard = function(e) {
        if (!window.formstackAndroidInterface) return !1;
        window.formstackAndroidInterface.onScanCreditcard(e)
    }, Formstack.Android.onCreditCard = function(e, t) {
        e = document.getElementById("field" + e);
        if (!e) return !1;
        e.value = t
    }, Formstack.Util = {
        lcFirst: function(e) {
            return e[0].toLowerCase() + e.slice(1)
        }
    }, Formstack.Util.checkAll = function(e) {
        var t = e.target,
            e = $(t),
            e = $('[name="field' + e.attr("fs-data-field-id") + '[]"]');
        e.prop("checked", t.checked), e.trigger("change")
    }, Formstack.Util.scrollTo = function(e) {
        var t = $(e).offset(),
            i = $(e).css("margin-top"),
            e = $(e).css("margin-left"),
            i = Number(i.replace("px", "")),
            e = Number(e.replace("px", ""));
        window.scroll(t.left - e, t.top - i)
    }, Formstack.Util.getHeight = function(e) {
        e = $(e).height();
        return isNaN(e) ? 0 : e
    }, Formstack.Util.getWidth = function(e) {
        e = $(e).width();
        return isNaN(e) ? 0 : e
    }, Formstack.Util.getStartOfCurrentDate = function() {
        var e = new Date;
        return e.setHours(0, 0, 0, 0), e
    }, Formstack.Util.setDate = function(e) {
        var t, i = new Date,
            r = document.getElementById("field" + e + "Y");
        r && (a = r.options[1].value.length, t = i.getFullYear().toString(), r.value = t.substring(4 - a));
        var a = document.getElementById("field" + e + "M");
        a && (a.selectedIndex = i.getMonth() + 1);
        e = document.getElementById("field" + e + "D");
        e && (i = i.getDate(), e.value = i < 10 ? "0" + i : i)
    }, Formstack.Util.setTime = function(e) {
        var t = new Date,
            i = t.getHours(),
            r = document.getElementById("field" + e + "H");
        r && (a = i, r.options.length <= 13 && 12 < i && (a -= 12), 0 == a ? a = 12 : a < 10 && (a = "0" + a), r.value = a);
        var a = document.getElementById("field" + e + "I");
        a && (n = t.getMinutes(), a.value = n < 10 ? "0" + n : n);
        var n = document.getElementById("field" + e + "S");
        n && (t = t.getSeconds(), n.value = t < 10 ? "0" + t : t);
        e = document.getElementById("field" + e + "A");
        e && (e.selectedIndex = i < 12 ? 1 : 2)
    }, Formstack.Util.formatNumber = function(e, t) {
        for (isNaN(e.decimals) || (t = (t = parseFloat(t)).toFixed(e.decimals));
            /(\d+)(\d{3})/.test(t.toString());) t = t.toString().replace(/(\d+)(\d{3})/, "$1,$2");
        var i = null,
            r = null;
        return e.currency && (e.currencySymbol && (i = e.currencySymbol), e.currencyPrefix && (i = e.currencyPrefix), e.currencySuffix && (r = e.currencySuffix)), i && (t = i + t), r && (t += r), t
    }, Formstack.Util.monthToInt = function(e) {
        if (isFinite(e)) return parseInt(e);
        e = e.substr(0, 3).toLowerCase(), e = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(e);
        return -1 < e ? e + 1 : 0
    }, Formstack.Util.Loader = function() {
        this.loading = {}
    }, Formstack.Util.Loader.prototype.load = function(e, t) {
        var i, r;
        this.loading[e] ? this.loading[e].success.push(t) : (this.loading[e] = {
            success: [t]
        }, t = document.getElementsByTagName("head")[0] || document.documentElement, (i = document.createElement("script")).src = e, r = !1, i.onload = i.onreadystatechange = $.proxy(function() {
            r || i.readyState && "loaded" !== i.readyState && "complete" !== i.readyState || (r = !0, i.onload = i.onreadystatechange = null, this.success(e))
        }, this), t.insertBefore(i, t.firstChild))
    }, Formstack.Util.Loader.prototype.success = function(e) {
        if (this.loading[e])
            if (this.loading[e].success && this.loading[e].success.length) {
                for (var t = this.loading[e].success, i = t.length, r = 0; r < i; r++) t[r] && "function" == typeof t[r] && t[r]();
                delete this.loading[e]
            } else delete this.loading[e]
    }, Formstack.Util.addEvent = function(e, t, i) {
        t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent && t.attachEvent("on" + e, i)
    }, Formstack.Util.removeEvent = function(e, t, i) {
        t.addEventListener ? t.removeEventListener(e, i, !1) : t.attachEvent && t.detachEvent("on" + e, i)
    }, Formstack.Form.prototype._applyRequiredFieldValidation = function(e) {
        for (var t = !0, i = $(e), r = i.find(".fsRequired"), a = 0; a < r.length; a++) {
            var n = r[a],
                o = $(n).parents(".fsMatrixFieldset"),
                s = void 0 !== o[0],
                o = s && "disabled" === $(o[0]).attr("disabled");
            if (n.disabled || o) break;
            (t = this.checkRequired(n) && t) || this.hasAlreadyFailedValidation(n) || this.failedContainers.push(e), this.hasAlreadyFailedValidation(n) || (l = this.getFieldContainer(n), -1 !== (l = this.failedContainers.indexOf(l)) && this.failedContainers.splice(l, 1));
            var l = i.attr("fs-field-type");
            if (s || "checkbox" === l || "radio" === l) break
        }
        return t || $(e).addClass("fsValidationError"), t
    }, window.Formstack = Formstack, window.Formstack.Util.Loader = new Formstack.Util.Loader, String.prototype.trim || (Fj = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, String.prototype.trim = function() {
        return this.replace(Fj, "")
    })
}(window, jQuery);