const pvt_ssn = document.querySelector('.private-sessions')
const grp_ssn = document.querySelector('.group-sessions')
const mediaQuery = window.matchMedia('(min-width: 768px)')

pvt_ssn.addEventListener('mouseover', () => {
    if (mediaQuery.matches) {
        pvt_ssn.classList.add('hovered')
        grp_ssn.style.display = "none"
    }
})
pvt_ssn.addEventListener('mouseleave', () => {
    if (mediaQuery.matches) {

        pvt_ssn.classList.remove('hovered');
        grp_ssn.style.display = "unset"
    }
})
grp_ssn.addEventListener('mouseover', () => {
    if (mediaQuery.matches) {

        grp_ssn.classList.add('hovered')
        pvt_ssn.style.display = "none"
    }
})
grp_ssn.addEventListener('mouseleave', () => {
    if (mediaQuery.matches) {

        grp_ssn.classList.remove('hovered');
        pvt_ssn.style.display = "unset"
    }
})