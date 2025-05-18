const fileInput = document.getElementById("fileInput");
const selectImg = document.getElementById("selectImg");
const previewImg = document.getElementById("previewImg");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.getElementById("filterName");
const filterSlider = document.getElementById("filterSlider");
const filterValue = document.getElementById("filterValue");
const rotateOption = document.querySelectorAll(".rotate button");
const resetFilterBtn = document.getElementById("resetFilterBtn")
const saveImgBtn = document.getElementById("saveImgBtn")

let brightness = 100,
    saturation = 100,
    inversion = 0,
    grayscale = 0;

let rotate = 0, flipVertical = 1, flipHorizontal = 1;


const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}


const loadImg = () => {
    let file = fileInput.files[0];

    if (!file) return;

    previewImg.src = URL.createObjectURL(file);

    previewImg.addEventListener("load", () => {
        resetFilterBtn.click()
        document.querySelector(".container").classList.remove("disable");
    });
};

filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "brightness") {
            rotate -= 90
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;

    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }

    applyFilters()
};


rotateOption.forEach((option) => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "vertical") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }

        applyFilters()
    })
})


const resetFilter = () => {
    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;

    rotate = 0;
    flipVertical = 1;
    flipHorizontal = 1;

    filterOptions[0].click()

    applyFilters()
}


const saveImg = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = previewImg.naturalWidth
    canvas.height = previewImg.naturalHeight

    ctx.filter = previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
    ctx.translate(canvas.width / 2, canvas.height / 2)
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 100)
    }
    ctx.scale(flipVertical, flipHorizontal)
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)

    const link = document.createElement("a")
    link.download = "img.jpg"
    link.href = canvas.toDataURL()
    link.click()
}



saveImgBtn.addEventListener("click", saveImg)
resetFilterBtn.addEventListener("click", resetFilter)
filterSlider.addEventListener("input", updateFilter);
fileInput.addEventListener("change", loadImg);
selectImg.addEventListener("click", () => fileInput.click());
