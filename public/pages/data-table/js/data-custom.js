$('#crm_tablex').DataTable({

    serverSide: true,
    processing: true,
    searchable: true,
    aaSorting: [],
    ajax: {
        url: '/customer_list',
        type: 'POST'
    },
    columns: [
        { data: '_id' },
        { data: 'name' },
        { data: 'user_email' },
        { data: 'user_contact' },
        { data: 'address' }
    ]
});