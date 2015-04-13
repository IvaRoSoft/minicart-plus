/* ############################## */
var shipping_fee_fixed = 12.00,
    shipping_fee_per_kg = 6.50,
    shipping_txt = "Shipping and Handling",
    shipping_subtxt = "International Registered Mail",
    shipping_currency = "EUR",
    check_out_button_txt = "Check Out",
    cart_total_txt = "",
    discount_txt = "";
/* ############################## */

/* render shopping cart and reposition on the right*/
paypal.minicart.render({
    strings: {button: check_out_button_txt,
              subtotal: cart_total_txt,
              discount: discount_txt}
});

$('#PPMiniCart').css({
    "right": "10px",
    "left": "auto"
});

// every time an item is removed calculate and update the cart shipping weight
paypal.minicart.cart.on('remove', function(idx, product) {
    // do nothing if the item removed is the shipping cost
    if (product.get('item_name').contains("Shipping and Handling")) {
        return false;
    }

    // calculate shipping costs
    update_cart_shipping_cost(idx, product);
});

// every time a item quantity is modified calculate and update the cart shipping weight
// not implemented because not so easy...
//$("#PPMiniCart .minicart-quantity").on("change keyup paste click", function(){
//  console.log('bingo');
//})

// every time an item is removed calculate and update the cart shipping weight
paypal.minicart.cart.on('add', function(idx, product) {
    // do nothing if the item added is the shipping cost
    if (product.get('item_name').contains("Shipping and Handling")) {
        return false;
    }
    update_cart_shipping_cost(idx, product);
});

function update_cart_shipping_cost(idx, product) {
    /* delete any previous shipping charge item */
    var a, items = paypal.minicart.cart.items();
    for (var i = 0; i < items.length; i++) {
        if (items[i].get('item_name').contains("Shipping and Handling")) {
            paypal.minicart.cart.remove(i);
        }
    }

    /* get quantity and weight for each cart item and calculate total weight */
    var items = paypal.minicart.cart.items(),
        q = [],
        n1 = [],
        w = 0;
    var forms = $('#PayPalMiniCart form'),
        shipping_weight_g = 0;
    for (var i = 0; i < items.length; i++) {
        q.push(items[i].get('quantity'));
        n = items[i].get('item_name'); //shopping cart item name
        // search for the corresponding weight
        for (var ii = 0; ii < forms.length; ii++) {
            if (n.contains(forms.children('input[name="item_name"]')[ii].value)) {
                w = forms.children('input[name="weight_g"]')[ii].value;
                // total weight calculation
                shipping_weight_g += parseFloat(w * q[i]);
            }
        }
    }

    // calculate total shipping cost and add to cart
    var shipping_cost = shipping_fee_fixed + (shipping_weight_g / 1E3) * shipping_fee_per_kg;
    if (shipping_weight_g > 0) {
        shipping_cost = shipping_cost.toFixed(2);
    } else {
        shipping_cost = 0.00;
    }
    p = {
        "business": "example@minicartjs.com",
        "item_name": shipping_txt,
        "item_number": shipping_subtxt,
        "amount": shipping_cost,
        "currency_code": shipping_currency
    };
    paypal.minicart.cart.add(p);

    /* make all quantity field not editable */
    $('#PPMiniCart .minicart-quantity').attr("disabled", true);
    $('#PPMiniCart .minicart-quantity').css({'background':'white','border':'0','box-shadow':'none'});
        /* hide shipping cost item quantity and delete button*/
    $("#PPMiniCart .minicart-item").each(function() {
        if ($(this).find('.minicart-name').text().toLowerCase() == "shipping and handling") {
            $(this).find('.minicart-quantity').css('visibility', 'hidden');
            $(this).find('.minicart-remove').css('visibility', 'hidden');
        }
    });
    /* style close and check out buttons */
    $('.minicart-submit').css({
        'right':'142px',
        'min-width': '90px',
        'font-size': '13px',
        'font-weight': 'normal',
    });

    $('.minicart-closer').text('Continue Shopping');
    $('.minicart-closer').css({
      'position':'absolute',
      'right':'5px',
        'min-width': '90px',
        'font-size': '13px',
        'font-weight': 'normal',
        'margin': '-3px 0',
        'padding': '7px 9px',
        'background': 'linear-gradient(to bottom, #fff6e9 0%, #ffaa00 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
        'border': '1px solid #ffc727',
        'border-radius': '5px'
    });
    $('.minicart-closer').insertAfter('.minicart-submit');
}

/* show shopping cart*/
$('#PayPalMiniCart_ViewCart').click(function(e) {
    e.stopPropagation();
    paypal.minicart.view.show();

    /* make all quantity field not editable */
    $('#PPMiniCart .minicart-quantity').attr("disabled", true);
    $('#PPMiniCart .minicart-quantity').css({'background':'white','border':'0','box-shadow':'none'});
        /* hide shipping cost item quantity and delete button*/
    $("#PPMiniCart .minicart-item").each(function() {
        if ($(this).find('.minicart-name').text().toLowerCase() == "shipping and handling") {
            $(this).find('.minicart-quantity').css('visibility', 'hidden');
            $(this).find('.minicart-remove').css('visibility', 'hidden');
        }
    });
    /* style close and check out buttons */
    $('.minicart-submit').css({
        'right':'142px',
        'min-width': '90px',
        'font-size': '13px',
        'font-weight': 'normal',
    });
    $('.minicart-closer').text('Continue Shopping');
    $('.minicart-closer').css({
      'position':'absolute',
        'right':'5px',
        'min-width': '90px',
        'font-size': '13px',
        'font-weight': 'normal',
        'margin': '-3px 0',
        'padding': '7px 9px',
        'background': 'linear-gradient(to bottom, #fff6e9 0%, #ffaa00 100%) repeat scroll 0 0 rgba(0, 0, 0, 0)',
        'border': '1px solid #ffc727',
        'border-radius': '5px'
    });
    $('.minicart-closer').insertAfter('.minicart-submit');
});