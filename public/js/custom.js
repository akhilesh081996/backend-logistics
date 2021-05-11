
$(document).ready(function () {
    /* header agency list */
    $.ajax({
        'url': "/dashboard",
        'method': "POST",
    }).done(function(data) {
        let agencydata = data.data
        let a = ["<option value='0'>All</option>"]
        let b = ["<option value='' disabled>All</option>"]
        agencydata.forEach(element => {
            let data = sessionStorage.getItem('agencyID')
            if (data == element.agency_id) {
                a += "<option selected value='" + element.agency_id + "'>" + element.agency_name + "</option>"
                b += "<option selected value='" + element.agency_id + "'>" + element.agency_name + "</option>"
            } else {
                a += "<option value='" + element.agency_id + "'>" + element.agency_name + "</option>"
                b += "<option value='" + element.agency_id + "'>" + element.agency_name + "</option>"
            }
        });
        $("#filterlist").append(a);
        $("#agencies_id").append(b);
        setOptions(); // function call
    });

    /* Remove duplicate list in vehicle class and fuel type */
    var optionValues = [];
    $('#vehicle_class option').each(function () {
        if ($.inArray(this.value, optionValues) > -1) {
            $(this).remove()
        } else {
            optionValues.push(this.value);
        }
    });

    var optionValue = [];
    $('#fuel_type option').each(function () {
        if ($.inArray(this.value, optionValue) > -1) {
            $(this).remove()
        } else {
            optionValue.push(this.value);
        }
    });

    /* End */

    let sessionID = window.sessionStorage.getItem('agencyID');
    if (sessionID) {
        document.getElementById('agency').value = sessionID;
    }

    // let e = document.getElementById("agency");
    // let strUser = e.options[e.selectedIndex].value;
    // if (strUser)
    //     getOption(strUser)
});

function setOptions() {
    agencyid = document.querySelector('#filterlist').value;
    sessionStorage.setItem('agencyID', agencyid);
    if(window.location.pathname == '/users/0'){
    let e = document.getElementById("agency").value = agencyid;
    getOption(e)
    }

}

/* End */

function getOption(id) {
    if(id){
        agencyid = id
    }else{
        let elem = document.getElementById("agency")
        agencyid = elem.options[elem.selectedIndex].value;
    }
    if (agencyid == 0) {
        $("#role").html("<option value='all'>All</option>");
        role_type = document.querySelector('#role').value;
        filterlist(role_type, agencyid)
    } else {
        $.ajax({
            'url': "/roles/" + agencyid,
            'method': "GET",
        }).done(function(data) {
            let result = data.data
            $("#role").empty();
            if (result.length) {
                for (let i = 0; i <= result.length; i++) {
                    let id = result[i]['role_type'];
                    let name = result[i]['role_name'];
                    $("#role").append("<option value='" + id + "'>" + name + "</option>");
                    role_type = document.querySelector('#role').value;
                    filterlist(role_type, agencyid)
                }
            } else {
                filterlist(0, agencyid)
                $("#user").html('');
            }

        })
    }
}

/* Filter function on users list */
function filterlist(role, agency_id) {
    if (role == 'all' && agency_id == 0) {
        $.ajax({
            'url': "/users/" + role_type,
            'method': "POST",
            'data': { 'agency_id': agency_id }
        }).done(function (data) {
          let a = [];
            if (data.length) {
                data.forEach(element => {
                    let role = element.role == 1  ? "driver" : element.role == 2 ? "hr" : element.role == 3 ? "manager" : "others";
                    a += "<div class='col-lg-6 col-xl-3 col-md-6 pull-left'><div class='card rounded-card user-card'><div class='card-block'>"
                    a += "<div class='img-hover'><img class='img-fluid img-radius' id='image'  src='/public/uploads/"+element.agency_id + '/'+role+'/'+ element.profile_image+"' alt='round-img'>"
                    a += "<div class='img-overlay img-radius'><span><a href='/add_user/" + element.user_id + '/' + element.role + "'class='btn btn-sm btn-primary'>"
                    a += "<i class='icofont icofont-link-alt'></i></a><a href='/delete_user/" + element.user_id + "' class='btn btn-sm btn-primary' data-popup='lightbox'><i class='icofont icofont-ui-delete'></i></a>"
                    a += "</span></div></div><div class='user-content'><h4 class='' id='username'>" + element.username + "</h4>"
                    a += "<p class='m-b-0 text-muted' id='usercontact'>Contact : " + element.contact + "</div></div></div></div>"
                });
                $("#user").html(a);
            } else {
                $("#user").html('');
            }
        })

    } else {
        let role_type;
        if (role) {
            role_type = role
        } else {
            role_type = document.querySelector('#role').value;
            let e = document.getElementById("agency");
            agency_id = e.options[e.selectedIndex].value;
        }

        $.ajax({
            'url': "/users/" + role_type,
            'method': "POST",
            'data': { 'agency_id': agency_id }
        }).done(function (data) {
            let a = [];
            //console.log("DATA --->", data);
            if (data.length) {
                data.forEach(element => {
                    let role = element.role == 1  ? "driver" : element.role == 2 ? "hr" : element.role == 3 ? "manager" : "others";
                    a += "<div class='col-lg-6 col-xl-3 col-md-6 pull-left'><div class='card rounded-card user-card'><div class='card-block'>"
                    a += "<div class='img-hover'><img class='img-fluid img-radius' id='image'  src='/public/uploads/"+element.agency_id + '/'+role+'/'+ element.profile_image+"' alt='round-img'>"
                    a += "<div class='img-overlay img-radius'><span><a href='/add_user/" + element.user_id + '/' + element.role + "'class='btn btn-sm btn-primary'>"
                    a += "<i class='icofont icofont-link-alt'></i></a><a href='/delete_user/" + element.user_id + "' class='btn btn-sm btn-primary' data-popup='lightbox'><i class='icofont icofont-ui-delete'></i></a>"
                    a += "</span></div></div><div class='user-content'><h4 class='' id='username'>" + element.username + "</h4>"
                    a += "<p class='m-b-0 text-muted' id='usercontact'>Contact : " + element.contact + "</div></div></div></div>"
                });
                $("#user").html(a);
            } else {
                $("#user").html('');
            }

        })
    }
}

/* Validation functions  crm */

function getemail() {
    let email = document.getElementById('user_email').value;
    if (email) {
        $.ajax({
            'url': "/validate_email_customer",
            'method': "POST",
            'data': { 'user_email': email }
        }).done(function(data) {

            if (data) {
                if (data.status == '101') {
                    let errormsg = data.message
                    $('#erroremail').html(errormsg)
                } else if (data.status == '100') {
                    $("#erroremail").html('');;
                }
            }

        })
    }
}

function getcontact() {
    let contact = document.getElementById('contact_no').value;
    if (contact) {
        $.ajax({
            'url': "/validate_contact_customer",
            'method': "POST",
            'data': { 'contact_no': contact }
        }).done(function(data) {

            if (data) {
                if (data.status == '101') {
                    let errormsg = data.message
                    $('#errorcontact').html(errormsg)
                } else if (data.status == '100') {
                    $("#errorcontact").html('');
                }
            }

        })
    }
}

/* Validation function agency form */
function agencyEmail() {
    let email = document.getElementById('user_email').value;
    if (email) {
        $.ajax({
            'url': "/validate_agency_email",
            'method': "POST",
            'data': { 'email': email }
        }).done(function(data) {
            if (data) {
                if (data.status == '101') {
                    let errormsg = data.message
                    $('#erroremail').html(errormsg)
                } else if (data.status == '100') {
                    $("#erroremail").html('');;
                }
            }

        })
    }
}

function agencyName() {
    let name = document.getElementById('agency_name').value;
    if (name) {
        $.ajax({
            'url': "/validate_agency_name",
            'method': "POST",
            'data': { 'agency_name': name }
        }).done(function(data) {
            if (data) {
                if (data.status == '101') {
                    let errormsg = data.message
                    $('#errorname').html(errormsg)
                } else if (data.status == '100') {
                    $("#errorname").html('');;
                }
            }

        })
    }
}

/* End */

/* Validation function for vehicle form */

function getRegistration(){
    let registration_no = document.getElementById('registration_no').value;
    if (registration_no) {
        $.ajax({
            'url': "/validate_registration_no",
            'method': "POST",
            'data': { 'registration_no': registration_no }
        }).done(function (data) {
            if (data) {
                if (data.status == '101') {
                    let errormsg = data.message
                    $('#error_registraion').html(errormsg)
                } else if (data.status == '100') {
                    $("#error_registraion").html('');;
                }
            }

        })
    }

}

function getChassis(){
    let chassis_no = document.getElementById('chassis_no').value;
    if (chassis_no) {
        $.ajax({
            'url': "/validate_chassis_no",
            'method': "POST",
            'data': { 'chassis_no': chassis_no }
        }).done(function (data) {
            if (data) {
                if (data.status == '101') {
                    let errormsg = data.message
                    $('#error_chassis').html(errormsg)
                } else if (data.status == '100') {
                    $("#error_chassis").html('');;
                }
            }

        })
    }

}

function getEngine(){
    let engine_no = document.getElementById('engine_no').value;
    if (engine_no) {
        $.ajax({
            'url': "/validate_engine_no",
            'method': "POST",
            'data': { 'engine_no': engine_no }
        }).done(function (data) {
            if (data) {
                if (data.status == '101') {
                    let errormsg = data.message
                    $('#error_engine').html(errormsg)
                } else if (data.status == '100') {
                    $("#error_engine").html('');;
                }
            }

        })
    }

}
/* End */


/* Validation function for users */
function usersEmail() {
    let email = document.getElementById('email').value;
    if (email) {
        $.ajax({
            'url': "/validate_user_email",
            'method': "POST",
            'data': { 'email': email }
        }).done(function(data) {
            if (data) {
                if (data.status == '101') {
                    let errormsg = data.message
                    $('#erroremail').html(errormsg)
                } else if (data.status == '100') {
                    $("#erroremail").html('');;
                }
            }

        })
    }
}
/* End */

/* add more option in dropdownlist in vehicle add form */

function addmore() {
    var getval = document.querySelector("#vehicle_class").value;
    if (getval == 0) {
        $('#addoptions').show();

    } else {
        $('#addoptions').hide()
    }

}

function add_fuel_type() {
    var getval = document.querySelector("#fuel_type").value;
    if (getval == '') {
        $('#add_fuel').show()
    } else {
        $('#add_fuel').hide()
    }

}
/* End */

function openSideSection(that, user_id) {
    var this_obj = $(that)
    var today = moment().format('dddd, D MMMM YYYY')
    $('#attendance-entryDate').text(today)
    $('#user_id').val(user_id)


    // Make ajax call to fetch the checkin and checkout times of current date
    $.ajax({
        type: "POST",
        url: '/get_user_attendance',
        data: { 'user_id': user_id, date: '' },
        success: function(response) {
            console.log(response.status);
            if ($.trim(response.status) == '100') {

            } else {

            }
        }
    });

    var data = { 'user_id': user_id, date: '' }
    fetchAttendance(data)

    $(".overlay").fadeIn()
    $(".popout").addClass("left-animate")
}

function showNewEntry(that) {
    var this_obj = $(that)
    $(".modal-popout-document").show();
    //var min_time = moment($('#last_checkout').text(), ["h:mm a"]);

}

// To save the attendance
function saveAttendance() {
    var form = $("#attendance_form");
    var data = { 'user_id': $('#user_id').val(), date: '' }

    $.ajax({
        type: "POST",
        url: form.attr("action"),
        async: false,
        data: $("#attendance_form").serialize(), //only input

        success: function(response) {
            console.log(response.status);
            //if ($.trim(response.status) == '100') {
            //success: function(response) {
            if ($.trim(response.status) == '100') {
                console.log(response.status);
                fetchAttendance(data)
            } else {

            }
        }
    });
    hideAttendanceForm()
    $("#notes").val('')
}

function fetchAttendance(data) {

    // Make ajax call to fetch the checkin and checkout times of current date
    $.ajax({
        type: "POST",
        url: '/get_user_attendance',
        data: data,
        success: function(response) {
            console.log(response.status);
            if ($.trim(response.status) == '100') {
                if (response.data) {
                    $('.show-user-attendance').find('tbody').html(response.data.attendance)
                    $('#first_checkin').text(response.data.first_checkin)
                    $('#last_checkout').text(response.data.last_checkout)
                    $('#total_hours').text(response.data.total_hours)
                } else {}
            } else {
                if (response.data) {
                    $('.show-user-attendance').find('tbody').html(response.data.attendance)
                    $('#first_checkin').text(response.data.first_checkin)
                    $('#last_checkout').text(response.data.last_checkout)
                    $('#total_hours').text(response.data.total_hours)
                } else {}
            }
        }
    });
}

function hideAttendanceForm() {
    $('.modal-popout-document').hide()

    // Clear the form values
    $("#datetimepicker1").data("DateTimePicker").date(null)
    $("#datetimepicker2").data("DateTimePicker").date(null)
    $("#notes").val('')
}

$(document).ready(function() {

    $(".cross").click(function() {
        $(".overlay").fadeOut()
        $(".popout").removeClass("left-animate")
        hideAttendanceForm()
    })

    $('#datetimepicker1').datetimepicker({
        icons: {
            time: "icofont icofont-clock-time",
            //date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        },
        format: 'LT',
        minDate: moment('12:00 AM', ["h:mm a"])
    });

    $('#datetimepicker2').datetimepicker({
        icons: {
            time: "icofont icofont-clock-time",
            date: "icofont icofont-ui-calendar",
            up: "icofont icofont-rounded-up",
            down: "icofont icofont-rounded-down",
            next: "icofont icofont-rounded-right",
            previous: "icofont icofont-rounded-left"
        },
        format: 'LT',
        maxDate: moment('11:59 PM', ["h:mm a"])
    });

    $("#datetimepicker1").on("dp.change", function(e) {

        if ($('#last_checkout').text() != '-') {
            min_time = moment($('#last_checkout').text(), ["h:mm a"]);
            $('#datetimepicker1').data("DateTimePicker").minDate(min_time);
        } else {
            min_time = e.date
        }

        $('#datetimepicker2').data("DateTimePicker").defaultDate(moment('11:59 PM', ["h:mm a"]));
        $('#datetimepicker2').data("DateTimePicker").minDate($('#datetimepicker1').data("DateTimePicker").date());
    });
    $("#datetimepicker2").on("dp.change", function(e) {
        //$('#datetimepicker2').data("DateTimePicker").minDate($('#datetimepicker1').data("DateTimePicker").date());
        //$('#datetimepicker1').data("DateTimePicker").maxDate($('#datetimepicker1').data("DateTimePicker").date());
        $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
    });
})

// update customer 

function getselect() {
    var skillsSelect = document.getElementById("agencies_id");
    var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
    document.getElementById('agency_name').value = selectedText;
}

$(window).on("load", function () {
    var skillsSelect = document.getElementById("agencie");
    var selectedText = skillsSelect.options[skillsSelect.selectedIndex].value;
    document.getElementById('agency_id').value = selectedText;
    
    var skills = document.getElementById("agencie");
    var Text = skills.options[skills.selectedIndex].text; 
    document.getElementById('agency_name').value = Text;

});

//