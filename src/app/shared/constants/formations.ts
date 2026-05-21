import { Formation } from '../../models/formation.model';

export const FORMATIONS: Formation[] = [

{
    name: '4-2-3-1',
    slots: [
        { key:'1', label:'GK', x:50, y:85 },
        { key:'3', label:'LB', x:15, y:72 },
        { key:'5', label:'CB', x:38, y:75 },
        { key:'4', label:'CB', x:62, y:75 },
        { key:'2', label:'RB', x:85, y:72 },
        { key:'6', label:'CDM', x:34, y:52 },
        { key:'8', label:'CDM', x:66, y:52 },
        { key:'10', label:'CAM', x:50, y:40 },
        { key:'7', label:'LW', x:18, y:35 },
        { key:'9', label:'ST', x:50, y:15 },
        { key:'11', label:'RW', x:82, y:35 },
    ]
},

{
    name: '4-3-3',
    slots: [
        { key:'1', label:'GK', x:50, y:85 },

        { key:'3', label:'LB', x:15, y:72 },
        { key:'5', label:'CB', x:38, y:75 },
        { key:'4', label:'CB', x:62, y:75 },
        { key:'2', label:'RB', x:85, y:72 },
        { key:'6', label:'CM', x:28, y:52 },
        { key:'10', label:'CM', x:50, y:48 },
        { key:'8', label:'CM', x:72, y:52 },
        { key:'7', label:'LW', x:18, y:25 },
        { key:'9', label:'ST', x:50, y:15 },
        { key:'11', label:'RW', x:82, y:25 },
    ]
},

{
    name: '4-4-2',
    slots: [
        { key:'1', label:'GK', x:50, y:85 },
        { key:'3', label:'LB', x:15, y:72 },
        { key:'5', label:'CB', x:38, y:75 },
        { key:'4', label:'CB', x:62, y:75 },
        { key:'2', label:'RB', x:85, y:72 },
        { key:'7', label:'LM', x:15, y:45 },
        { key:'6', label:'CM', x:38, y:48 },
        { key:'8', label:'CM', x:62, y:48 },
        { key:'11', label:'RM', x:85, y:45 },
        { key:'9', label:'ST', x:35, y:15 },
        { key:'10', label:'ST', x:65, y:15 },
    ]
},

{
    name: '5-2-3',
    slots: [
        { key:'1', label:'GK', x:50, y:85 },
        { key:'5', label:'CB', x:33, y:67 },
        { key:'4', label:'CB', x:50, y:62 },
        { key:'2', label:'CB', x:67, y:67 },
        { key:'3', label:'LWB', x:15, y:60 },
        { key:'6', label:'CM', x:40, y:45 },
        { key:'8', label:'CM', x:60, y:45 },
        { key:'11', label:'RWB', x:85, y:60 },
        { key:'7', label:'LW', x:25, y:30 },
        { key:'9', label:'ST', x:50, y:15 },
        { key:'10', label:'RW', x:75, y:30 },
    ]
},

{
    name: '5-3-2',
    slots: [
        { key:'1', label:'GK', x:50, y:85 },
        { key:'5', label:'CB', x:33, y:67 },
        { key:'4', label:'CB', x:50, y:62 },
        { key:'2', label:'CB', x:67, y:67 },
        { key:'3', label:'LWB', x:15, y:60 },
        { key:'8', label:'CM', x:28, y:40 },
        { key:'6', label:'CM', x:50, y:40 },
        { key:'7', label:'CM', x:72, y:40 },
        { key:'11', label:'RWB', x:85, y:60 },
        { key:'9', label:'ST', x:35, y:15 },
        { key:'10', label:'ST', x:65, y:15 },
    ]
}

];