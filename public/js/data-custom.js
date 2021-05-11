// Datatables start

// Customer list table
$('#simpletable').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
        url: '/customer_list',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: function(d) {
            let sessionID = sessionStorage.getItem('agencyID')
            if (sessionID) {
                d.agencyID = sessionID;
            } else {
                d.agencyID = ' ';
            }
            return JSON.stringify(d)
        }
    },
    columnDefs: [
        { targets: [6], orderable: false }
    ],
    columns: [
        { 'name': '_id' },
        { 'name': 'first_name' },
        { 'name': 'last_name' },
        { 'name': 'user_email' },
        { 'name': 'contact_no' },
        { 'name': 'city' }
    ]
})

// Roles list table
$('#roles_list').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
        url: '/roles',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: function(d) {
            let sessionID = sessionStorage.getItem('agencyID')
            if (sessionID) {
                d.agencyID = sessionID;
            } else {
                d.agencyID = ' ';
            }

            return JSON.stringify(d)
        }
    },
    columnDefs: [
        { targets: [4], orderable: false }
    ],
    columns: [
        { 'name': 'role_type' },
        { 'name': 'role_name' },
        { 'name': 'agency.agency_name' },
        { 'name': 'description' }
    ]
})

// Agency list table
$('#agencies_list').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
        url: '/agencies',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: function(d) {
            return JSON.stringify(d)
        }
    },
    columnDefs: [
        { targets: [0, 5], orderable: false }
    ],
    columns: [
        { 'name': 'logo' },
        { 'name': 'agency_name' },
        { 'name': 'email' },
        { 'name': 'contact' },
        { 'name': 'status' }
    ]
})

// Vehicle list table
$('#vehicles_list').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
        url: '/vehicles',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: function(d) {
            console.log(d)
            let sessionID = sessionStorage.getItem('agencyID')
            if (sessionID) {
                d.agencyID = sessionID;
            } else {
                d.agencyID = ' ';
            }
            return JSON.stringify(d)
        }
    },
    columnDefs: [
        { targets: [5], orderable: false }
    ],
    columns: [
        { 'name': 'registration_no' },
        { 'name': 'maker_name' },
        { 'name': 'agency.agency_name' },
        { 'name': 'owner_name' },
        { 'name': 'owner_contact_no' }
    ]
})

// Service log list table
$('#service_log_list').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
        url: '/service_log',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: function(d) {
            return JSON.stringify(d)
        }
    },
    columnDefs: [
        { targets: [0, 5], orderable: false }
    ],
    columns: [
        { 'name': 'registration_no' },
        { 'name': 'service_date' },
        { 'name': 'workshop_name' },
        { 'name': 'workshop_contact' },
        { 'name': 'total_cost' }
    ]
})

// Attendance list table
$('#attendance_list').DataTable({
    processing: true,
    serverSide: true,
    ajax: {
        url: '/attendance',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: function(d) {
            return JSON.stringify(d)
        }
    },
    columnDefs: [
        { targets: [0, 6, 7], orderable: false }
    ],
    columns: [
        { 'name': 'profile_image' },
        { 'name': 'username' },
        { 'name': 'email' },
        { 'name': 'contact' },
        { 'name': 'roledetail.role_name' },
        { 'name': 'agencyedetail.agency_name' },
        { 'name': 'attendance' },
        { 'name': 'view' }
    ]
})