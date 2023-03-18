$(document).ready(function(){

    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "visible");


    // side-bar control

    function closeSidebar(){
        let sideBarInfoWidth = $(".side-bar-info").innerWidth();
        $(".side-bar").animate({left: -sideBarInfoWidth} , 500);

        $(".sidebar-control-icon").addClass("fa-align-justify");
        $(".sidebar-control-icon").removeClass("fa-xmark");

        $(".side-bar-links ul li").animate({top:300}, 500);
    }
    closeSidebar();

    function openSidebar(){
        $(".side-bar").animate({left: 0} , 500);

        $(".sidebar-control-icon").addClass("fa-xmark");
        $(".sidebar-control-icon").removeClass("fa-align-justify");

        for (let i = 0; i < 5; i++) {
            $(".side-bar-links ul li").eq(i).animate({top:0}, (i + 5) * 100);
        }

    }

    $(".sidebar-control-icon").click(function(){
        let sideLeft = $(".side-bar").css("left");
        if(sideLeft == "0px")
        {
            closeSidebar();
        }
        else
        {
            openSidebar();
        }
    })




    //search

    async function searchByName(mealName)
    {
        $(".section-loading-screen").css("display","flex").hide().fadeIn(300);

        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
        let finalResponse = await apiResponse.json();

        $(".section-loading-screen").fadeOut(300);
        if(finalResponse.meals == null)
        {
            let arr = [];
            displayMeals(arr);
        }
        else
        {
            // console.log(finalResponse);
            // console.log(finalResponse.meals);
            displayMeals(finalResponse.meals);
        }

        
    }
    searchByName("");


    async function searchByLetter(firstLetter)
    {
        if(firstLetter == "")
        {
            firstLetter = "a"
        }
        $(".section-loading-screen").css("display","flex").hide().fadeIn(300);

        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`);
        let finalResponse = await apiResponse.json();

        $(".section-loading-screen").fadeOut(300);

        if(finalResponse.meals == null)
        {
            let arr = [];
            displayMeals(arr);
        }
        else
        {
            // console.log(finalResponse);
            // console.log(finalResponse.meals);
            displayMeals(finalResponse.meals);
        }

    }


    function displayMeals(meals)
    {
        let cartona = ``;
        for (let i=0 ; i<meals.length ; i++)
        {
            cartona += `<div class="col-md-3">

                <div class="item meal-item rounded-2" id="${meals[i].idMeal}"> 

                    <img class="w-100 rounded-2" src="${meals[i].strMealThumb}" alt="image">
                    <div class="food-layer rounded-2 p-2 d-flex align-items-center">
                        <h3 class="text-black">${meals[i].strMeal}</h3>
                    </div>

                </div>

            </div>`
        }
        $("#rowData").html(cartona);
        mealEvent();
    }

    function putSearchInputs()
    {
        let cartona = ``;
        cartona = `<div class="row py-4">

            <div class="col-md-6">
                <input id="nameSearchInput" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>

            <div class="col-md-6">
                <input id="letterSearchInput" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>

        </div>`
        $("#searchInputs").html(cartona);

        searchInputEvent();

    }


    $("#search").click(function(){
        putSearchInputs();
        closeSidebar();
        $("#rowData").html("");
    })

    function searchInputEvent()
    {
        $("#nameSearchInput").on("input" , function(event){
            searchByName(event.target.value);
            closeSidebar();
            // console.log(event.target.value)
        })

        $("#letterSearchInput").on("input" , function(eventInfo){
            searchByLetter(eventInfo.target.value);
            closeSidebar();
        })
    }



    //instructions
    
    function mealEvent()
    {
        let meals1 = $(".meal-item")
        for(let i=0 ; i<meals1.length ; i++)
        {
            $(meals1[i]).click(function(){
                mealDetails($(meals1[i]).attr("id"));
            })

        }
    }

    async function mealDetails(mealId)
    {
        // console.log(mealId);
        closeSidebar();
        $(".section-loading-screen").css("display","flex").hide().fadeIn(300);

        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        let finalResponse1 = await apiResponse.json();

        $(".section-loading-screen").fadeOut(300);
        // console.log(finalResponse1);
        // console.log(finalResponse1.meals);
        displayDetails(finalResponse1.meals)
    }

    function displayDetails(mealInstructions)
    {
        $("#searchInputs").html("");

        let ulList = ``;
        for(let i=1 ; i<=20 ; i++) 
        {  
            let ingredient = `strIngredient${i}`;
            if(mealInstructions[0][ingredient] != "")
            {
                let measure = `strMeasure${i}`
                ulList += `<li class="alert m-2 p-1">${mealInstructions[0][measure]} ${mealInstructions[0][ingredient]}</li>`
            }
        }

        let tags = mealInstructions[0].strTags;
        let ulTags = ``;
        if(tags != null)
        {
            let tagsArr = tags.split(',');
        
            for(let i=0 ; i<tagsArr.length ; i++)
            {
                ulTags += `<li class="alert m-2 p-1">${tagsArr[i]}</li>`
            }

        }

        let cartona = ``;
        cartona = `<div class="col-md-4">

            <div class="item meal-instructions-image">
                <img class="w-100 rounded-3" src="${mealInstructions[0].strMealThumb}" alt="image">
                <h2>${mealInstructions[0].strMeal}</h2>
            </div>

        </div>

        <div class="col-md-8">

            <div class="item meal-instructions-info">

                <h2>Instructions</h2>
                <p>${mealInstructions[0].strInstructions}</p>
                <h3><span>Area :</span> ${mealInstructions[0].strArea}</h3>
                <h3><span>Category :</span> ${mealInstructions[0].strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="d-flex flex-wrap p-0 instructions-first-ul">
                    ${ulList}
                </ul>
                <h3>Tags :</h3>
                <ul class="d-flex flex-wrap p-0 instructions-second-ul">
                    ${ulTags}
                </ul>
                <a href="${mealInstructions[0].strSource}" class="btn btn-success" target="_blank">Source</a>
                <a href="${mealInstructions[0].strYoutube}" class="btn btn-danger" target="_blank">Youtube</a>

            </div>

        </div>`
         
        $("#rowData").html(cartona);

    }


    // categories

    async function getCategories()
    {
        closeSidebar();
        $(".section-loading-screen").css("display","flex").hide().fadeIn(300);

        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        let finalResponse = await apiResponse.json();

        $(".section-loading-screen").fadeOut(300);
        // console.log(finalResponse);
        // console.log(finalResponse.categories);
        displayCategories(finalResponse.categories)
    }

    function displayCategories(categories)
    {
        let cartona = ``;
        for(let i=0 ; i<categories.length ; i++)
        {
            cartona += `<div class="col-md-3">

                <div id="${categories[i].strCategory}" class="item meal-item category-item rounded-2"> 

                    <img class="w-100 rounded-2" src="${categories[i].strCategoryThumb}" alt="image">
                    <div class="food-layer rounded-2 p-2 text-center">
                        <h3 class="text-black">${categories[i].strCategory}</h3>
                        <p class="text-black">${categories[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>

                </div>

            </div>`
        }

        $("#rowData").html(cartona);
        $("#searchInputs").html("");
        
        categoryEvent();

    }

    async function getMealsByCategory (categoryName)
    {
        closeSidebar();
        $(".section-loading-screen").css("display","flex").hide().fadeIn(300);

        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
        let finalResponse3 = await apiResponse.json();

        $(".section-loading-screen").fadeOut(300);
        // console.log(finalResponse3.meals);
        let newArr = []
        for(let i=0; i < finalResponse3.meals.length ; i++)
        {
            if(i<20)
            {
                newArr.push(finalResponse3.meals[i]);
            }
            else
            {
                break;
            }
        }
        // console.log(newArr)
        displayMeals(newArr);

    }



    function categoryEvent()
    {
        let categoryItem = $(".category-item");
        for(let i=0 ; i<categoryItem.length ; i++)
        {
            $(categoryItem[i]).click(function(){
                // console.log($(categoryItem[i]).attr("id"));
                getMealsByCategory ($(categoryItem[i]).attr("id"));
            })
        }
    
    }

    
    $("#categories").click(function(){
        getCategories();
    })




    // Area

    async function getAreas()
    {
        closeSidebar();
        $(".section-loading-screen").css("display","flex").hide().fadeIn(300);

        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        let finalResponse = await apiResponse.json();

        $(".section-loading-screen").fadeOut(300);
        // console.log(finalResponse.meals);
        displayAreas(finalResponse.meals);
    }

    function displayAreas(Areas)
    {
        let cartona = ``;
        for(let i=0 ; i<Areas.length ; i++)
        {
            cartona += `<div class="col-md-3">

                <div id="${Areas[i].strArea}" class="item area-item text-center"> 

                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${Areas[i].strArea}</h3>

                </div>

            </div> `
        }

        $("#rowData").html(cartona);
        $("#searchInputs").html("");
        
        AreaEvent();

    }


    async function getMealsByAreas (areaName)
    {
        closeSidebar();
        $(".section-loading-screen").css("display","flex").hide().fadeIn(300);

        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
        let finalResponse3 = await apiResponse.json();

        $(".section-loading-screen").fadeOut(300);
        // console.log(finalResponse3.meals);
        let newArr = []
        for(let i=0; i < finalResponse3.meals.length ; i++)
        {
            if(i<20)
            {
                newArr.push(finalResponse3.meals[i])
            }
            else
            {
                break;
            }
        }
        // console.log(newArr)
        displayMeals(newArr);

    }

    function AreaEvent()
    {
        let areaItem = $(".area-item");
        for(let i=0 ; i<areaItem.length ; i++)
        {
            $(areaItem[i]).click(function(){
                // console.log("hello")
                // console.log($(areaItem[i]).attr("id"));
                getMealsByAreas ($(areaItem[i]).attr("id"));
            })
        }
    
    }

    $("#area").click(function(){
        getAreas();
    })




    // ingredients

    async function getIngredients()
    {
        closeSidebar();
        $(".section-loading-screen").css("display","flex").hide().fadeIn(300);

        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        let finalResponse = await apiResponse.json();

        $(".section-loading-screen").fadeOut(300);
        // console.log(finalResponse.meals.slice(0,20));
        displayIngredients(finalResponse.meals.slice(0,20));

    }

    function displayIngredients(ingredient1)
    {
        let cartona = ``;
        for(let i=0 ; i<ingredient1.length ; i++)
        {
            cartona += `<div class="col-md-3">

                <div id="${ingredient1[i].strIngredient}" class="item area-item ingredient-item text-center"> 

                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${ingredient1[i].strIngredient}</h3>
                    <p>${ingredient1[i].strDescription.split(" ").slice(0,20).join(" ")}</p>

                </div>

            </div>`
        }

        $("#rowData").html(cartona);
        $("#searchInputs").html("");
        
        ingredientEvent();

    }


    async function getMealsByIngredient (ingredientName)
    {
        closeSidebar();
        $(".section-loading-screen").css("display","flex").hide().fadeIn(300);

        let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
        let finalResponse3 = await apiResponse.json();

        $(".section-loading-screen").fadeOut(300);
        // console.log(finalResponse3.meals);
        let newArr = []
        for(let i=0; i < finalResponse3.meals.length ; i++)
        {
            if(i<20)
            {
                newArr.push(finalResponse3.meals[i])
            }
            else
            {
                break;
            }
        }
        displayMeals(newArr);

    }


    function ingredientEvent()
    {
        let ingredientItem = $(".ingredient-item");
        for(let i=0 ; i<ingredientItem.length ; i++)
        {
            $(ingredientItem[i]).click(function(){
                // console.log($(ingredientItem[i]).attr("id"));
                getMealsByIngredient ($(ingredientItem[i]).attr("id"))
            })
        }
    
    }


    $("#ingredients").click(function(){
        // console.log("hello");
        getIngredients();
    })



    // contact
    
    let count = 0 ;

    function displayContactInputs()
    {
        let cartona = ``;
        cartona = `<div class="contact-form min-vh-100 d-flex justify-content-center align-items-center">

            <div class="container w-75 text-center">

                <div class="row g-4">

                    <div class="col-md-6">
                        <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                        <div class="alert contact-error w-100 mt-2 d-none">Special characters and numbers not allowed</div>
                    </div>

                    <div class="col-md-6">
                        <input id="emailInput" type="email" class="form-control " placeholder="Enter Your Email">
                        <div class="alert contact-error w-100 mt-2 d-none">Email not valid *exemple@yyy.zzz</div>
                    </div>

                    <div class="col-md-6">
                        <input id="phoneInput" type="text" class="form-control " placeholder="Enter Your Phone">
                        <div class="alert contact-error w-100 mt-2 d-none">Enter valid Phone Number</div>
                    </div>

                    <div class="col-md-6">
                        <input id="ageInput" type="number" class="form-control " placeholder="Enter Your Age">
                        <div class="alert contact-error w-100 mt-2 d-none">Enter valid age</div>
                    </div>

                    <div class="col-md-6">
                        <input id="passwordInput" type="password" class="form-control " placeholder="Enter Your Password">
                        <div class="alert contact-error w-100 mt-2 d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
                    </div>


                    <div class="col-md-6">
                        <input id="repasswordInput" type="password" class="form-control " placeholder="Repassword">
                        <div class="alert contact-error w-100 mt-2 d-none">Enter valid repassword</div>
                    </div>

                </div>

                <button id="submitButton" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>

            </div>

        </div>`

        $("#rowData").html(cartona);

        inputsEvents();

    }

    function validateName()
    {
        let name11 = $("#nameInput").val();
        // console.log(name11)
        let regex = /^[a-z A-Z]{1,}$/ 
        return regex.test(name11)

    }


    function validateEmail()
    {
        let email11 = $("#emailInput").val();
        let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
        return regex.test(email11)

    }


    function validatePhone()
    {
        let phone11 = $("#phoneInput").val();
        let regex = /^(\+)?[(]?[0-9]{3}[)]?[\- \s \.]?[0-9]{3}[\- \s \.]?[0-9]{4,6}$/ 
        return regex.test(phone11)

    }


    function validateAge()
    {
        let age11 = $("#ageInput").val();
        let regex = /^(0{0,1}[1-9]|[1-9][0-9]|[1][0-9][0-9]|200)$/ 
        return regex.test(age11)

    }


    function validatePassword()
    {
        let password11 = $("#passwordInput").val();
        let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/ 
        return regex.test(password11)

    }


    function validateRepassword()
    {
        let repassword11 = $("#repasswordInput").val();
        let password11 = $("#passwordInput").val();
        return repassword11 == password11;

    }

    function validateAllInputs()
    {
        if(focus1)
        {
            if(validateName())
            {
                $("#nameInput").next().removeClass("d-block");
                $("#nameInput").next().addClass("d-none");
            }
            else
            {
                $("#nameInput").next().removeClass("d-none");
                $("#nameInput").next().addClass("d-block");
            }
        }

        if(focus2)
        {
            if(validateEmail())
            {
                $("#emailInput").next().removeClass("d-block");
                $("#emailInput").next().addClass("d-none");
            }
            else
            {
                $("#emailInput").next().removeClass("d-none");
                $("#emailInput").next().addClass("d-block");
            }
        }

        if(focus3)
        {
            if(validatePhone())
            {
                $("#phoneInput").next().removeClass("d-block");
                $("#phoneInput").next().addClass("d-none");
            }
            else
            {
                $("#phoneInput").next().removeClass("d-none");
                $("#phoneInput").next().addClass("d-block");
            }
        }

        if(focus4)
        {
            if(validateAge())
            {
                $("#ageInput").next().removeClass("d-block");
                $("#ageInput").next().addClass("d-none");
            }
            else
            {
                $("#ageInput").next().removeClass("d-none");
                $("#ageInput").next().addClass("d-block");
            }
        }


        if(focus5)
        {
            if(validatePassword())
            {
                $("#passwordInput").next().removeClass("d-block");
                $("#passwordInput").next().addClass("d-none");
            }
            else
            {
                $("#passwordInput").next().removeClass("d-none");
                $("#passwordInput").next().addClass("d-block");
            }
        }


        if(focus6)
        {
            if(validateRepassword())
            {
                $("#repasswordInput").next().removeClass("d-block");
                $("#repasswordInput").next().addClass("d-none");
            }
            else
            {
                $("#repasswordInput").next().removeClass("d-none");
                $("#repasswordInput").next().addClass("d-block");
            }
        }


        if(validateName() && validateEmail() && validatePhone() && validateAge() && validatePassword() && validateRepassword())
        {
            $("#submitButton").removeAttr("disabled");
        }
        else
        {
            $("#submitButton").attr("disabled","true");
        }


    }


    function inputsEvents()
    {

        $("#nameInput").on("input" , function(){
            // console.log($("#nameInput").val());
            // validateName();
            validateAllInputs();
        })

        $("#emailInput").on("input" , function(){
            // validateEmail();
            validateAllInputs();
        })

        $("#phoneInput").on("input" , function(){
            // validatePhone();
            validateAllInputs();
        })

        $("#ageInput").on("input" , function(){
            // validateAge();
            validateAllInputs();
        })

        $("#passwordInput").on("input" , function(){
            // validatePassword();
            validateAllInputs();
        })

        $("#repasswordInput").on("input" , function(){
            // validateRepassword();
            validateAllInputs();
        })

        $("#nameInput").focus(function(){
            focus1 = true;
        })

        $("#emailInput").focus(function(){
            focus2 = true;
        })

        $("#phoneInput").focus(function(){
            focus3 = true;
        })

        $("#ageInput").focus(function(){
            focus4 = true;
        })

        $("#passwordInput").focus(function(){
            focus5 = true;
        })

        $("#repasswordInput").focus(function(){
            focus6 = true;
        })


    }

    let focus1 = false;
    let focus2 = false;
    let focus3 = false;
    let focus4 = false;
    let focus5 = false;
    let focus6 = false;


    $("#contact").click(function(){

        displayContactInputs();
        closeSidebar();
        
    })

})



