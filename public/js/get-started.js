const pvt_ssn = document.querySelector('.private-sessions')
const grp_ssn = document.querySelector('.group-sessions')

pvt_ssn.addEventListener('mouseover', () => {
    pvt_ssn.classList.add('hovered')
    grp_ssn.style.display = "none"
})
pvt_ssn.addEventListener('mouseleave', () => {
    pvt_ssn.classList.remove('hovered');
    grp_ssn.style.display = "unset"
})
grp_ssn.addEventListener('mouseover', () => {
    grp_ssn.classList.add('hovered')
    pvt_ssn.style.display = "none"
})
grp_ssn.addEventListener('mouseleave', () => {
    grp_ssn.classList.remove('hovered');
    pvt_ssn.style.display = "unset"
})