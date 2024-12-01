const toggleTheme = () => {
    const body = document.getElementById("body");
    body.classList.toggle("dark-theme");

    const canvas = document.getElementById("art-canvas");
    canvas.classList.toggle("canvas-dark");
}