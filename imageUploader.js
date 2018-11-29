var url = "https://mall-api.airyrooms.com/"
var urlInternal = "https://mall-internal.airyrooms.com/v1/internal/image/upload"
var uploadImageCount = 0

$(document).ready(function () {
    $('.select2').select2();
    $.ajax({
        url: url + "v1/category/descendant",
        type: 'post',
        dataType: "json",
        data: JSON.stringify({
            data: {}
        }, ),
        contentType: "application/json",
        xhrFields: {
            withCredentials: false
        },
        success: function (res) {
            var categoryList = res.data.categories
            var flattenCat = flattenCategory(categoryList)
            for (var i = 0; i < flattenCat.length; i++) {
                $('#category-id')
                    .append('<option value="' + flattenCat[i].id + '" >' + flattenCat[i].name + '</option>');
                $('#inventory-category-id')
                    .append('<option value="' + flattenCat[i].id + '" >' + flattenCat[i].name + '</option>');
            }
        }
    });
});

function flattenCategory(cats) {
    var tmp = []
    for (var ii = 0; ii < cats.length; ii++) {
        var cat = cats[ii]
        tmp.push(cat)
        if (cat.categories.length != 0) {
            tmp = tmp.concat(flattenCategory(cat.categories))
        }
    }

    return tmp
}

function changeType() {
    var type = $('#type').val();
    if (type == "CATEGORY") {
        $(".div-hidden-category").show();
        $(".div-hidden-inventory").hide();
    } else if (type == "INVENTORY") {
        $(".div-hidden-inventory").show();
        $(".div-hidden-category").hide();
    }
}

function fetchInventory() {
    var categoryId = $("#inventory-category-id").val()
    $.ajax({
        url: url + "v1/inventory/byCategory",
        type: 'post',
        dataType: "json",
        data: JSON.stringify({
            data: {
                categoryId: categoryId
            }
        }, ),
        contentType: "application/json",
        xhrFields: {
            withCredentials: false
        },
        success: function (res) {
            $('#inventory-id').children('option:not(:first)').remove();

            var inventories = res.data.inventories
            for (var i = 0; i < inventories.length; i++) {
                $('#inventory-id')
                    .append('<option value="' + inventories[i].id + '" >' + inventories[i].name + '</option>');
            }
        }
    });
}

function uploadedImage(input) {
    for (var i = 0; i < input.files.length; i++) {
        $('#images').append('<img id="upload-image-' + i + '" src="" alt="image" class="upload-image" /><br>');
    }
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#upload-image-0')
                .attr('src', e.target.result)
                .width(150)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);

    }

    for (var i = 0; i < input.files.length; i++) {
        if (input.files && input.files[i]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#upload-image-' + uploadImageCount++)
                    .attr('src', e.target.result)
                    .width(150)
                    .height(200);
            };

            reader.readAsDataURL(input.files[i], i);

        }
    }
}