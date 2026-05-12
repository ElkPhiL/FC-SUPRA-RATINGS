import { Formation } from '../../models/formation.model';

export const FORMATIONS: Formation[] = [

{
    name: '4-3-3',
    slots: [
        { key:'GK', label:'GK', x:50, y:92 },

        { key:'LB', label:'LB', x:15, y:72 },
        { key:'CB1', label:'CB', x:38, y:75 },
        { key:'CB2', label:'CB', x:62, y:75 },
        { key:'RB', label:'RB', x:85, y:72 },

        { key:'CM1', label:'CM', x:28, y:52 },
        { key:'CM2', label:'CM', x:50, y:48 },
        { key:'CM3', label:'CM', x:72, y:52 },

        { key:'LW', label:'LW', x:18, y:25 },
        { key:'ST', label:'ST', x:50, y:18 },
        { key:'RW', label:'RW', x:82, y:25 },
    ]
},

{
    name: '4-4-2',
    slots: [
        { key:'GK', label:'GK', x:50, y:92 },
        { key:'LB', label:'LB', x:15, y:72 },
        { key:'CB1', label:'CB', x:38, y:75 },
        { key:'CB2', label:'CB', x:62, y:75 },
        { key:'RB', label:'RB', x:85, y:72 },
        { key:'LM', label:'LM', x:15, y:45 },
        { key:'CM1', label:'CM', x:38, y:48 },
        { key:'CM2', label:'CM', x:62, y:48 },
        { key:'RM', label:'RM', x:85, y:45 },
        { key:'ST1', label:'ST', x:35, y:18 },
        { key:'ST2', label:'ST', x:65, y:18 },
    ]
},

{
    name: '4-2-3-1',
    slots: [
        { key:'GK', label:'GK', x:50, y:92 },
        { key:'LB', label:'LB', x:15, y:72 },
        { key:'CB1', label:'CB', x:38, y:75 },
        { key:'CB2', label:'CB', x:62, y:75 },
        { key:'RB', label:'RB', x:85, y:72 },
        { key:'CDM1', label:'CDM', x:30, y:52 },
        { key:'CDM2', label:'CDM', x:70, y:52 },
        { key:'CAM', label:'CAM', x:50, y:40 },
        { key:'LW', label:'LW', x:18, y:35 },
        { key:'ST', label:'ST', x:50, y:18 },
        { key:'RW', label:'RW', x:82, y:35 },
    ]
},

];