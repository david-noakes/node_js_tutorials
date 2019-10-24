
function buildUrl(url, parameters) {
    let qs = "";
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            qs +=
                encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }

    return url;
}


const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    const prodPrice = btn.parentNode.querySelector('[name=productPrice]').value;
    const prodImgUrl = btn.parentNode.querySelector('[name=imageUrl]').value;
    console.log('prodId:', prodId, 'csrf:', csrf, 'prodPrice:', prodPrice, 'prodImgUrl:', prodImgUrl );
  
    const productElement = btn.closest('article');

    fetch(
        buildUrl('/admin/product/' + prodId, {
        prodPrice: prodPrice,
        imageUrl: prodImgUrl
      }), {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf
      }
    })
      .then(result => {
        return result.json();
      })
      .then(data => {
        console.log(data);
        productElement.parentNode.removeChild(productElement);
      })
      .catch(err => {
        console.log(err);
      });
  };
