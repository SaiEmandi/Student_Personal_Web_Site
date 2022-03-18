$(document).ready(function(){
    document.getElementById('loader').style.display = "block";
    document.getElementById('projecttab').style.display = "none";
    get_projects()
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();
    // Append table with add proj form on add new button click
    $(".add-new").click(function(){
        $(this).attr("disabled", "disabled");
        var index = $("table tbody tr:last-child").index();
        var proj = '<tr id="newrow"><form id="newitemform">' +
            '<td>#</td>' +
            '<td><input type="text" class="form-control" name="newname" id="newname" required></td>' +
            '<td><textarea class="form-control" name="newdescription" rows="4" columns="30" id="newdescription" required></textarea></td>' +
            '<td><input type="date" name="newitemsdate" id="newstartdate" class="form-control" required></td>' +
            '<td><input type="date" name="newitemedate" id="newenddate" class="form-control" required></td>' +
            '<td><a class="newadd" title="Add" data-toggle="tooltip" id="newadd"><i class="fa fa-plus"></i></a><a class="newdelete" title="Delete" id="newdelete"><i class="fa fa-trash-o"></i></a>'+
            '</td></form></tr>';
        $("table").append(proj);
        $("table tbody tr").eq(index + 1).find(".add, .edit, .delete").toggle();
        $('[data-toggle="tooltip"]').tooltip();
        document.getElementById("noproject").innerHTML = ''
    });

    // Add proj on add button click
    $(document).on("click", ".add", function(){
        console.log("Asss.....................................")
        var empty = false;
        var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
            if(!$(this).val()){
                $(this).addClass("error");
                empty = true;
            } else{
                $(this).removeClass("error");
            }
        });
        var txtid = $("#txtid").val();
        var txtname = $("#txtname").val();
        var txtdescription = $("#txtdescription").val();
        $.post("/ajax_add", { txtid: txtid, txtname: txtname, txtdescription: txtdescription}, function(data) {
            $("#displaymessage").html(data);
            $("#displaymessage").show();
        });
        $(this).parents("tr").find(".error").first().focus();
        if(!empty){
            input.each(function(){
                $(this).parent("td").html($(this).val());
            });
            $(this).parents("tr").find(".add, .edit").toggle();
            $(".add-new").removeAttr("disabled");
        }
    });
    // Delete proj on delete button click
    $(document).on("click", ".delete", function(){
        $(this).parents("tr").remove();
        $(".add-new").removeAttr("disabled");
        var id = $(this).attr("id");
        var string = id;
        console.log("Delete ID.................", id)
        fetch("/projectdetails/api/"+id+"/", {
            method: "DELETE",
        })
        .then(response => response.json())
        .then(json => {
            document.getElementById('projecttab').disabled = true
            get_projects()

        })
    });
    // update rec proj on edit button click
    $(document).on("click", ".update", function(){
        var id = $(this).attr("id");
        var string = id;
        var txtid = $("#txtid").val();
        var txtname = $("#txtname").val();
        var txtdescription = $("#txtdescription").val();
        var start_date = $("#estart_date").val();
        var end_date = $("#eend_date").val();
        fetch("/projectdetails/api/"+id+"/", {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
             body: JSON.stringify({ id: id, name: txtname, description: txtdescription, start_date: start_date, end_date: end_date})
        })
        .then(response => response.json())
        .then(json => {
            document.getElementById('projecttab').disabled = true
            get_projects()
            $(".add-new").attr("disabled", false);
        })
    });
    // Edit proj on edit button click
    $(document).on("click", ".edit", function(){
        $(this).parents("tr").find("td:not(:last-child)").each(function(i){
            if (i=='0'){
                var idname = 'txtid';
            }else if (i=='1'){
                var idname = 'txtname';
            }else if (i=='2'){
                var idname = 'txtdescription';
            }else if (i=='3'){
                var idname = 'estart_date';
            }else if (i=='4'){
                var idname = 'eend_date';
            }else{}
            if(i==1){
                $(this).html('<input type="text" max-length=100 name="updaterec" id="' + idname + '" class="form-control" value="' + $(this).text() + '" required>');
            }else if(i==2){
                $(this).html('<textarea max-length=1000 name="updaterec" id="' + idname + '" class="form-control" required>'+$(this).text()+'</textarea>');
            }else if(i==3 || i==4){
                $(this).html('<input type="date" name="updaterec" id="' + idname + '" class="form-control" value="' + $(this).text() + '" required>');
            }
        });
        $(this).parents("tr").find(".add, .edit").toggle();
        $(".add-new").attr("disabled", "disabled");
        $(this).parents("tr").find(".add").removeClass("add").addClass("update");
    });
    //Delete the newly temp item
    $(document).on("click", ".newdelete", function(){
        $(this).parents("tr").remove();
        $("#newrow").remove();
        $(".add-new").removeAttr("disabled");
    });

    $(document).on("click", ".newadd", function(){
        console.log("Add new row logic here...........................................")
        console.log($('#newname').val())
        console.log($('#newdescription').val())
        console.log($('#newstartdate').val())
        console.log($('#newenddate').val())
        if($('#newname').val() === '' || $('#newdescription').val() === '' || $('#newstartdate').val() === '' || $('#newenddate').val() === ''){
            console.log("Please fill all the fields")
            toastr.error('Please fill all the fields');
        }else{
            console.log("Ready to create a new object...................")
            fetch("/projectdetails/api/", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                 body: JSON.stringify({name: $('#newname').val(), description: $('#newdescription').val(), start_date: $('#newstartdate').val(), end_date: $('#newenddate').val()})
            })
            .then(response => response.json())
            .then(json => {
                document.getElementById('projecttab').disabled = true
                get_projects()
                $(".add-new").attr("disabled", false);
            })
        }
    });




});

function get_projects() {
    document.getElementById('loader').style.display = "block";
    fetch("/projectdetails/api/")
    // Converting received data to JSON
    .then(response => response.json())
    .then(json => {
        var tdata = ''
        var tdata = '<thead><tr><th width="1px">#</th><th width="20px">Name</th><th width="40px">Description</th><th width="15px">Start Date</th><th width="15px">End Date</th><th width="5px">Actions</th></tr></thead><tbody>'
        // Create a variable to store HTML
        if(json && json.data &&  json.data.length > 0){
            for(var pdata of json.data){
                tdata += '<tr><td width="1px">'+pdata.id+'</td><td>'+pdata.name+'</td><td>'+pdata.description+'</td><td>'+pdata.start_date+'</td><td>'+pdata.end_date+'</td>'
                tdata +='<td><a class="add" title="Add" data-toggle="tooltip" id="'+pdata.id +'"><i class="fa fa-save"></i></a><a class="edit" title="Edit" data-toggle="tooltip" id="'+pdata.id+'"><i class="fa fa-pencil"></i></a><a class="delete" title="Delete" data-toggle="tooltip" id="'+pdata.id+'"><i class="fa fa-trash-o"></i></a>'
            }
            tdata += '</tbody>'
            document.getElementById("projects_table").innerHTML = tdata
            document.getElementById('projecttab').style.display = "block";
            document.getElementById('loader').style.display = "none";
            document.getElementById('projecttab').disabled = false;
        }else{
            document.getElementById("projects_table").innerHTML = tdata
            document.getElementById("noproject").innerHTML = '<h1>No Projects Exist</h1>'
            document.getElementById('projecttab').style.display = "block";
            document.getElementById('loader').style.display = "none";
//            document.getElementById('projecttab').disabled = false;
        }
    });
}