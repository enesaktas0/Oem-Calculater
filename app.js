// Storage Controller
const StorageController = (function(){

    return{
        storeProduct : function (product){
            let products;
            if(localStorage.getItem('products')===null){
                products = [];
                products.push(product);
            }else{
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products' , JSON.stringify(products));
        },
        getStore : function(){
            if(localStorage.getItem('products') === null){
                products = [];
            }else{
                products = JSON.parse(localStorage.getItem('products')); 
            }
            return products;
        },
        upDateProduct: function(product){
            products = JSON.parse(localStorage.getItem('products'))

            products.forEach((prd,index) => {
                if(product.id == prd.id){
                    products.splice(index,1,product);
                }
            })
            localStorage.setItem('products',JSON.stringify(products));
        },
        deleteProduct: function(product){
            products = JSON.parse(localStorage.getItem('products'));
            products.forEach((prd,index) => {
                if(product.id == prd.id){
                    products.splice(index,1);
                }
            })
            localStorage.setItem('products',JSON.stringify(products));
        }
    }

})();
// Product Controller
const ProductController = (function(){

   const Product = function(id,name,price){
    this.id = id;
    this.name = name;
    this.price = price; 
   }

   const data = {
    products : StorageController.getStore(),
    selectedProduct : null,
    totalPrice : 0

   }
   return {
    getProucts: function(){
        return data.products;
    },
    getData: function(){
        return data;
    },
    addNewProduct: function(products,name,price){
        let id ; 
        
        if(data.products.length > 0){
            id = data.products[data.products.length-1].id + 1; 
        }else{
            id = 0;
        }
       
        const newProduct = new Product (id,name,parseFloat(price))
        products.push(newProduct);
        return newProduct
    },
    getTotal: function (){
        data.totalPrice = 0;
        data.products.forEach((prt) => {
            data.totalPrice += prt.price
        })
        return data.totalPrice
    },
    selectedLine : function (e) {
        let allProducts = document.querySelector(UIController.getSelectors().productList).children;
        for(let all of allProducts){
            all.classList = '';
        }
        e.target.parentElement.parentElement.classList.add('bg-warning');
    },
    selectedLineClear : function(){
        let allProducts = document.querySelector(UIController.getSelectors().productList).children;
        for(let all of allProducts){
            all.classList = '';
        }
    } 
   }


})();
// UI Controller
const UIController = (function(){
    var dolar = 20;

    const Selectors = {
        productList : "#table-body",
        addBtn : "#addBtn",
        productPrice : "#price",
        productName : "#name",
        productCard : "#productCard",
        productCardFotter : "#productCardFotter",
        alert : "#alert",
        totalTl : "#totalTl",
        totalDolar : "#totalDolar",
        cancel : "#cancel",
        delete : "#delete",
        saveChange : "#saveChange",
    }

    return{
        createProductList: function(products){
            document.querySelector(Selectors.productList).innerHTML = '';
            for(let prd of products){
                let html = `
                <tr>
                    <td scope="row">${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>$ ${prd.price}</td>
                    <td class="text-end">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </td>
                </tr>
                `
                document.querySelector(Selectors.productList).innerHTML += html;
            }
        },
        getSelectors : function(){
            return Selectors
        },
        clearInputs: function(){
            document.querySelector(UIController.getSelectors().productName).value = '';
            document.querySelector(UIController.getSelectors().productPrice).value = '';
        },
        cardControl : function() {
            if(ProductController.getData().products.length == 0){
                document.querySelector(Selectors.productCard).classList.add('d-none');
                document.querySelector(Selectors.productCardFotter).classList.add('d-none');
            }else{
                if(document.querySelector(Selectors.productCard).classList.contains('d-none')){
                    document.querySelector(Selectors.productCard).classList.remove('d-none');
                    document.querySelector(Selectors.productCardFotter).classList.remove('d-none');
                }  
            }
        },
        showAlert : function(){
            document.querySelector(Selectors.alert).classList.remove('d-none');
            let html = `
            <div class="alert alert-danger" role="alert">
                Wrong Input !
            </div>
            `;
            document.querySelector(Selectors.alert).innerHTML = html;
        },
        clearAlert : function(){
            document.querySelector(Selectors.alert).innerHTML = '';
            document.querySelector(Selectors.alert).classList.add('d-none');
        },
        showTotalPrice : function (price){
            tl = price * dolar;
            document.querySelector(Selectors.totalDolar).innerText = `${price} $`;
            document.querySelector(Selectors.totalTl).innerText = `${tl} TL`;
        },
        editOpen : function(){
            document.querySelector(Selectors.addBtn).classList.add('d-none');
            document.querySelector(Selectors.saveChange).classList.remove('d-none');
            document.querySelector(Selectors.delete).classList.remove('d-none');
            document.querySelector(Selectors.cancel).classList.remove('d-none');

        },
        editClose : function(){
            document.querySelector(Selectors.addBtn).classList.remove('d-none');
            document.querySelector(Selectors.saveChange).classList.add('d-none');
            document.querySelector(Selectors.delete).classList.add('d-none');
            document.querySelector(Selectors.cancel).classList.add('d-none');
        },
        elementControl : function(e){
            elementId = e.target.parentElement.parentElement.children[0].innerText;
            products = ProductController.getData().products;
            products.forEach((prd) => {
                if(prd.id == elementId){
                    selectedProduct = prd;
                }
            })
            document.querySelector(UIController.getSelectors().productName).value = selectedProduct.name;
            document.querySelector(UIController.getSelectors().productPrice).value = selectedProduct.price;
            ProductController.getData().selectedProduct = selectedProduct;
        },
        upDateElement : function(product){
            var name = document.querySelector(Selectors.productName).value;
            var price = document.querySelector(Selectors.productPrice).value;

            prds = ProductController.getData().products;
            prds.forEach((prd)=> {
                if(prd.id == product.id){
                    prd.name = name;
                    prd.price =parseFloat(price);
                    upDateItem = prd;
                }
            });
            return upDateItem;
        },
        deleteElement: function(product){
            let deletedItem;
            element = ProductController.getData().selectedProduct;
            product.forEach((prd, index)=>{
                if(prd.id == element.id){
                    deletedItem = prd;
                    ProductController.getData().products.splice(index,1);
                }
            })
            return deletedItem;
        }
    }

})();
// App Controller
const App = (function(ProductCtrl,UICtrl,StorageCtrl){           
    const products = ProductCtrl.getProucts();
    const UICtrlSelectors = UICtrl.getSelectors();

    const loadEventListener = function(){
        document.querySelector(UICtrlSelectors.addBtn).addEventListener("click", (e) => {
            var name = document.querySelector(UICtrlSelectors.productName).value;
            var price = document.querySelector(UICtrlSelectors.productPrice).value;

            if(name != '' && price != ''){
                const newProduct = ProductCtrl.addNewProduct(products,name,price);
                
                StorageCtrl.storeProduct(newProduct);
                
                ProductCtrl.getTotal();

                UICtrl.createProductList(products);
                UICtrl.clearInputs();
                UICtrl.cardControl();
                UICtrl.showTotalPrice(ProductCtrl.getTotal());
            }else{
                UICtrl.showAlert();
                setTimeout(UICtrl.clearAlert,3000);
            }
            e.preventDefault();
        });
        document.querySelector(UICtrlSelectors.productList).addEventListener("click", (e) => {
            if(e.target.classList == "fa-solid fa-pen-to-square"){
                UICtrl.editOpen();
                UICtrl.elementControl(e);
                ProductCtrl.selectedLine(e);
            }
        });
        document.querySelector(UICtrlSelectors.cancel).addEventListener("click", (e) => {
            UICtrl.editClose();
            UICtrl.clearInputs();
            ProductCtrl.selectedLineClear();
            e.preventDefault();
        });
        document.querySelector(UICtrlSelectors.delete).addEventListener("click", (e) => {
            const deleteElement = UICtrl.deleteElement(products);
            UICtrl.createProductList(products);
            ProductCtrl.getTotal();
            UICtrl.showTotalPrice(ProductCtrl.getTotal());
            UICtrl.editClose();
            UICtrl.clearInputs();
            UICtrl.cardControl();
            StorageCtrl.deleteProduct(deleteElement);
            e.preventDefault();
        });
        document.querySelector(UICtrlSelectors.saveChange).addEventListener("click", (e) => {
            var name = document.querySelector(UICtrlSelectors.productName).value;
            var price = document.querySelector(UICtrlSelectors.productPrice).value;
            if(name != '' && price != ''){
                const upDateElement = UICtrl.upDateElement(ProductController.getData().selectedProduct);
                UICtrl.editClose();
                UICtrl.clearInputs();
                ProductCtrl.selectedLineClear();
                UICtrl.createProductList(products);
                ProductCtrl.getTotal();
                UICtrl.showTotalPrice(ProductCtrl.getTotal());
                StorageCtrl.upDateProduct(upDateElement);
            }else{
                UICtrl.showAlert();
                setTimeout(UICtrl.clearAlert,3000);
            }
            e.preventDefault();
        });

    }

    return{
        init: function(){
            ProductCtrl.getTotal();
            UICtrl.showTotalPrice(ProductCtrl.getTotal());
            UICtrl.createProductList(products);
            UICtrl.cardControl();

            loadEventListener();
        }
    }

})(ProductController,UIController,StorageController);

App.init();
