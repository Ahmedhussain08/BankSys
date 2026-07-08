// Frontend JavaScript — shared UI behaviour (sidebar toggle, active nav state)

function toggleSidebar(){
    document.getElementById('sidebar').classList.toggle('open');
}

document.addEventListener('click', function(e){
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('mobileToggle');
    if(!sidebar || !toggle) return;
    if(sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)){
        sidebar.classList.remove('open');
    }
});
