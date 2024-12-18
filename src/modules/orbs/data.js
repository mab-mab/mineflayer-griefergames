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
        customName: '§6Deine Orbs'
        
    }
}