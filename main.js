import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import {elements} from './data.js';
import { randInt } from 'three/src/math/MathUtils.js';
//initial setup
const mycanvas = document.querySelector('#canvas');
const wraper = mycanvas.parentElement;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, wraper.clientWidth/ wraper.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: mycanvas, antialias:true});
renderer.setSize(wraper.clientWidth, wraper.clientHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
function resize() {
    const width = wraper.clientWidth;
    const height = wraper.clientHeight;
    camera.aspect = width/height

    renderer.setSize(width,height)
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize()
const properties_wraper = document.querySelector('.properties_window_wraper')
const resizeObserver = new ResizeObserver(() => {
    resize();
});
if (wraper) resizeObserver.observe(wraper);
camera.position.z = 30;
camera.position.y = 20;
camera.lookAt(0,0,0);
//control
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
//define colors
const electron_color = "#75aafa"
const proton_color = "#bd112e"
const neutron_color = "#b8bab9"
const orbital_color = "#787b80"
const active_orbital_color = "#73c795"
const active_electron_color = "#4a92ff"
const inactive_orbital_color = "#373737"
const inactive_electron_color = "#3e4760"


let electrons = new Map();


//proton creating
function create_particle(posx = 0, posy = 0, posz = 0, color) {
    const sphere = new THREE.SphereGeometry(2);
    const mat = new THREE.MeshBasicMaterial({ color: color });
    const particle = new THREE.Mesh(sphere, mat);

    particle.position.set(posx,posy,posz)
    scene.add(particle);
}
function create_electron(curve, start) {
    const sphere = new THREE.SphereGeometry(1);
    const mat = new THREE.MeshBasicMaterial({ color: electron_color, transparent: true, opacity: 1});
    const particle = new THREE.Mesh(sphere, mat);
    // const startPoint = curve.getPointAt(start);
    // particle.position.set(startPoint.x, startPoint.y, startPoint.z);
    scene.add(particle)
    return particle
}


let show_clouds = false;
let selected_el = 1
const show_clouds_checkbox = document.getElementById('show_clouds_checkbox')
show_clouds_checkbox.addEventListener("change", (event) => {
    show_clouds = !show_clouds
    render_el(selected_el)
})
//===========================ORBITALS======================
function create_s_orbital(radius = 2, axis = 'y') {
    const curve_raw = new THREE.ArcCurve(0,0,radius);
    const random_rotation = new THREE.Euler(
        (Math.random()-0.5) * (Math.PI *2/ radius), 
        (Math.random()-0.5) * (Math.PI *2/ radius),
        (Math.random()-0.5) * (Math.PI *2/ radius)
        )
    let points_rotated = [];
    const points_number = 32 * radius
    if(axis == 'x') {
        for(let point of curve_raw.getPoints(points_number)) {
            points_rotated.push(new THREE.Vector3(0, point.y, point.x).applyEuler(random_rotation));
        }
    }
    else if(axis =='z'){
        for(let point of curve_raw.getPoints(points_number)) {
            points_rotated.push(new THREE.Vector3(point.x, point.y, 0));
        }
    } else {
        for(let point of curve_raw.getPoints(points_number)) {
            points_rotated.push(new THREE.Vector3(point.x, 0, point.y).applyEuler(random_rotation))
        }
    }
    const curve = new THREE.CatmullRomCurve3(points_rotated,true);
    //const geometry = new THREE.BufferGeometry().setFromPoints(points_rotated)
    const geometry = new LineGeometry();
    geometry.setFromPoints(points_rotated)
    const orbital_mat = new LineMaterial({ color: orbital_color, linewidth: 3});
    const orbital = new Line2(geometry, orbital_mat);
    const speed = 0.02 /radius;
    scene.add(orbital);
    if(show_clouds) {
        scene.add(new THREE.Mesh(new THREE.SphereGeometry(radius),new THREE.MeshBasicMaterial({color:"#8a92ff", transparent: true, opacity: 0.15, depthWrite: false})))
    }
    console.log('+')
    points_rotated = curve.getSpacedPoints(100*radius)
    return [points_rotated, speed, orbital];
}



function create_p_orbital(total_len, axis = 'x') {

    const width = Math.sqrt(total_len) * 1.8;
    const len = total_len - width
//len * 0.4 - 10//len * 0.4 
    const beta = Math.acos(width/len)
    const alpha = 2 * Math.PI - 2 * beta
    const height = width * Math.sin(beta);
    const line_length = Math.cos(Math.PI/2 - beta) * len;
    
    const arc_raw_1 = new THREE.ArcCurve(-len, 0, width,beta,  Math.PI * 2 - beta); 
    let points_rotated = [];
    if(axis == 'x') {
        for(let point of arc_raw_1.getPoints(64)) {
            points_rotated.push(new THREE.Vector3(point.x, point.y, 0));
        }
    }
    else if(axis =='z'){
        for(let point of arc_raw_1.getPoints(64)) {
            points_rotated.push(new THREE.Vector3(point.y, 0, point.x));
        }
    }
    else {
        for(let point of arc_raw_1.getPoints(64)) {
            points_rotated.push(new THREE.Vector3(0, point.x, point.y))
        }
    }

    const arc_raw_2 = new THREE.ArcCurve(len, 0, width, Math.PI + beta, Math.PI - beta)
    let points_rotated_2 = [];
    if(axis == 'x') {
        for(let point of arc_raw_2.getPoints(64).reverse()) {
            points_rotated_2.push(new THREE.Vector3(point.x, point.y, 0));
        }
    }
    else if(axis =='z'){
        for(let point of arc_raw_2.getPoints(64).reverse()) {
            points_rotated_2.push(new THREE.Vector3(point.y, 0, point.x));
        }
    }
    else {
        for(let point of arc_raw_2.getPoints(64).reverse()) {
            points_rotated_2.push(new THREE.Vector3(0, point.x, point.y))
        }
    }
    const line1 = new THREE.LineCurve3(points_rotated[points_rotated.length - 1], points_rotated_2[0])
    const line2 = new THREE.LineCurve3(points_rotated_2[points_rotated_2.length-1], points_rotated[0])
    const points_all = points_rotated.concat(line1.getPoints(100)).concat(points_rotated_2).concat(line2.getPoints(100))
    const curve = new THREE.CatmullRomCurve3(points_all)
    const orbital_mat = new LineMaterial({ color: orbital_color, linewidth: 3});
    const curve_points = curve.getSpacedPoints(100*len)
    const geometry = new LineGeometry().setFromPoints(curve_points);
    const orbital = new Line2(geometry, orbital_mat);
    scene.add(orbital);
    
    return [curve_points, 0.02/len,orbital];
}




function arrange_particles(protons, neutrons) {
    let particles = [];
    const particles_count = protons + neutrons;
    const radius = Math.pow(particles_count, 1/3) * 1.2
    let to_create = [];
    for(let i = 0; i<protons; i++) to_create.push(proton_color)
    for(let i = 0; i<neutrons; i++) to_create.push(neutron_color)
    let search_radius = 2.5;
    for(let color of to_create) {  //for each particle to create
        let placed = 0;
        let attempts = 0;
        while(!placed) {   //trying to place particle
            attempts ++ 
            if(attempts>100) {  //increase search radius if too many attemps
                search_radius += 0.5
                attempts = 0;
            }
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = Math.cbrt(Math.random()) * search_radius;

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            let enought_length = true;
            for(let particle of particles) {  //colision check
                const dist = Math.sqrt(Math.pow(particle[0] - x, 2) + Math.pow(particle[1] -y, 2) + Math.pow(particle[2] - z, 2))
                if(dist<3.8) {
                    enought_length = false;
                    break;
                }
            }
            if (enought_length) {
                particles.push([x,y,z,color]); 
                placed = true;
            }
        }
    }
    for(let el of particles) {
        create_particle(el[0], el[1], el[2], el[3])
    }
    console.log('+')
    return particles;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let orbitals_list = new Map();


const orientation_selection_menu = document.querySelector('#orientation_selection_menu')
//updating electron configuration label in properties window
const electron_conf = document.querySelector(".electron_conf");
function update_electron_conf(key) {
    electron_conf.innerHTML = elements[key].config;
}
//============================================selecting orbital
let selected_orbital = '';
properties_wraper.addEventListener('click', (event) => {
    if (event.target.classList.contains('orbital-clickable')) {
        const orbital_name = event.target.dataset.orbital; 
        selected_orbital = orbital_name.slice(0,2)
        orientation_selection_menu.innerHTML = ''
        orientation_selection_menu.add(new Option('all','all'))
        if (orbital_name[1] == 's' || orbital_name.slice(2) == '1') {
            orientation_selection_menu.classList.add('hidden')
        }else{
            orientation_selection_menu.classList.remove('hidden')
            
                orientation_selection_menu.add(new Option('x', 'x'));
            if (parseInt(orbital_name.slice(2)) >= 2) {
                orientation_selection_menu.add(new Option('y', 'y'));
            }if (parseInt(orbital_name.slice(2))>=3) {
                orientation_selection_menu.add(new Option('z', 'z'));
            }
            if (orbital_name[1] == 'd' || orbital_name[1] == 'f') {
                if (parseInt(orbital_name[2])>=4) {
                    orientation_selection_menu.add(new Option('u','u'))
                }if (parseInt(orbital_name[2]) >= 5) {
                    orientation_selection_menu.add(new Option('w','w'))
                }
            }
            
        }
        for(const [orb,name] of orbitals_list) {
            if(name.slice(0,2)==orbital_name.slice(0,2)) {
                orb.material.color.set(active_orbital_color);
            }
            else{
                orb.material.color.set(inactive_orbital_color)
            }
        }
        for(const [electron,array] of electrons) {
            if(array[3].slice(0,2) == orbital_name.slice(0,2)) {
                electron.material.color.set(active_electron_color)
                electron.material.opacity = 1;
                electron.material.needsUpdate = true;
            }
            else{
                electron.material.color.set(inactive_electron_color)
                electron.material.opacity = 0.5
                electron.material.needsUpdate = true;
            }
            
        }
    }
});
orientation_selection_menu.addEventListener('change', (event) => {
    const selected_orientation = event.target.value;
    for(const [orb,name] of orbitals_list) {
            if(name == selected_orbital + selected_orientation || (selected_orientation == 'all' && name.slice(0,2) == selected_orbital)) {
                orb.material.color.set(active_orbital_color);
            }
            else{
                orb.material.color.set(inactive_orbital_color)
            }
        }
    for(const [electron,array] of electrons) {
            if(array[3] == selected_orbital+selected_orientation || (selected_orientation == 'all' && array[3].slice(0,2) == selected_orbital)) {
                electron.material.color.set(active_electron_color)
                electron.material.opacity = 1;
                electron.material.needsUpdate = true;           }
            else{
                electron.material.color.set(inactive_electron_color)
                 electron.material.opacity = 0.5
                electron.material.needsUpdate = true;           }
            
        }
})
const deselect_button = document.querySelector(".deselect_button")
deselect_button.addEventListener("click", () => {
    orientation_selection_menu.classList.add('hidden')
    selected_orbital = ''
    for(const [electron,array] of electrons) {
        electron.material.color.set(electron_color);
        electron.material.opacity = 1;
        electron.material.needsUpdate = true;
    }
    for(const [orb,] of orbitals_list) {
        orb.material.color.set(orbital_color)
    }
})
//animation_function (used in the end)
function animate() {
    requestAnimationFrame(animate);  
    for (const [electron, array] of electrons) {
        const point = array[1]
        const points_array = array[0]
        const speed = array[2];
        const pos = points_array[Math.floor(point * points_array.length)]
        //pos = curve.getPointAt(point);
        electron.position.set(pos.x, pos.y, pos.z);
        let next_point = (point+speed) % 1
        if(next_point<0) {
            next_point += 1
        } 
        array[1] =next_point
    }
    controls.update();
    renderer.render(scene, camera);
}


const neutrons_number_label = document.querySelector('.neutrons_number')
const protons_number_label = document.querySelector('.protons_number')
const dialog = document.querySelector('#selection_menu')
const el_name = document.querySelectorAll('.el_name');
function change_title(element) {
    for(const i of el_name) {
        i.textContent = element;
    } 
}
//==========================================================SELECTING ELEMENTS
for(let el_index = 1; el_index < elements.length; el_index += 1) {
    const el = elements[el_index];
    document.getElementById(el.symbol).addEventListener('click', () => {
        render_el(el_index)
        dialog.close();
        change_title(el.name);
        update_electron_conf(el_index)
        protons_number_label.textContent = el_index;
        neutrons_number_label.textContent = el.neutrons;
    });
}

/////////////////////////////////rendering elements
function render_el(number) {
    selected_el = number
    electrons.clear();
    scene.clear();
    orbitals_list.clear();
    const n = number
    arrange_particles(number, elements[number].neutrons)
    const orbitals_max = [
        { name: '1s', max: 2 },
        { name: '2s', max: 2 }, { name: '2p', max: 6 },
        { name: '3s', max: 2 }, { name: '3p', max: 6 },
        { name: '4s', max: 2 }, { name: '3d', max: 10 }, { name: '4p', max: 6 },
        { name: '5s', max: 2 }, { name: '4d', max: 10 }, { name: '5p', max: 6 },
        { name: '6s', max: 2 }, { name: '4f', max: 14 }, { name: '5d', max: 10 }, { name: '6p', max: 6 },
        { name: '7s', max: 2 }, { name: '5f', max: 14 }, { name: '6d', max: 10 }, { name: '7p', max: 6 }
    ];
    for(const orb of orbitals_max) {
        let size = 0
        let create_orbital = () => {}
        let orientations = []
        if(number > 0) {
            if (orb.name[1] == 's') {
                size = parseInt(orb.name[0]) * 10 + n*0.25 
                orientations = ['y']
                create_orbital = (size,orientation) => create_s_orbital(size,orientation);
            }else if(orb.name[1]=='p') {
                size = parseInt(orb.name[0]) * 10 + n*0.25 + 3
                //if(orb.name[0] == '2') size = 40 + n*0.25
                orientations = ['x','y','z']
                create_orbital = (size,orientation) => create_p_orbital(size,orientation);
            }
            let local_orbitals = []
            let electrons_to_add = Math.min(number,orb.max) 
            for(const orient of orientations) {
                if(electrons_to_add <=0) break;
                const l = create_orbital(size,orient)
                const [points_array, speed, orbital] = l 
                l.push(orient)
                const start_point = Math.random()
                l.push(start_point)
                electrons.set(create_electron(), [points_array,start_point,speed,orb.name + orient])
                local_orbitals.push(l)
                orbitals_list.set(orbital, orb.name+orient)
                electrons_to_add -= 1
                number -= 1
                
            }
            for(const orbital of local_orbitals) {
                if (electrons_to_add <= 0) break;
                electrons.set(create_electron(), [orbital[0],(orbital[4]+0.5)%1,orbital[1],orb.name+orbital[3]])
                number -=1
                electrons_to_add -= 1
            }
            
        }
    }
} 

render_el(1)
update_electron_conf(1)
animate()