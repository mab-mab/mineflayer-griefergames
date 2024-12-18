module.exports = {
    chatPatterns: {
        saleSuccessful: /^\[Orbs\] Du hast erfolgreich ([\d\.,]+) \S+ für ([\d\.,]+) Orbs verkauft\.$/,
    },
    windows: {
        trader: {
            titlePattern: /^Händler$/
        }
    },
    npc: {
        identifier: 'Händler',
        position: [172, 25, -42],
        world: 'orbs'
    },
    itemPatterns: {
        orbBalance:{
            name: 'skull', // The name of the item (a skull in this case)
            customName: '§6Deine Orbs'     // The custom name you want to match (without color codes)
        },
        back:{
            name: 'skull', // The name of the item (a skull in this case)
            customName: '§6Zurück zur vorherigen Seite'     // The custom name you want to match (without color codes)
        }
    }
}