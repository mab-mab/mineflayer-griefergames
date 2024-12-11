module.exports = {
    chatPatterns: {
        success: /^\[Orbs\] Du hast erfolgreich ([\d\.,]+) \S+ für ([\d\.,]+) Orbs verkauuft\.$/,
    },
    windowPatterns: {
        orbsMenu: /^Trader$/
    },
    npc: {
        identifier: 'Händler',
        position: [172, 25, -42],
        world: 'orbs',
        onInteract: 'windowOpen:orbs->orbsMenu',
    }
}