module.exports = {
    chatPatterns: {
        success: /^\[Orbs\] Du hast erfolgreich ([\d\.,]+) \S+ für ([\d\.,]+) Orbs verkauft\.$/,
    },
    windowPatterns: {
        orbsMenu: /^§6Händler$/
    },
    npc: {
        identifier: 'Händler',
        position: [172, 25, -42],
        world: 'orbs',
        onInteract: 'windowOpen:orbsMenu',
    }
}