import { generateQueryConstructor } from "../utils/objext.utils.js";
import PathFindingGrid from "../lib/pathfinding/Grid.js";
import BreadthFirstFinder from "../lib/pathfinding/BreadthFirstFinder.js";

window.BreadthFirstFinder = BreadthFirstFinder
window.PathFindingGrid = PathFindingGrid

class GridPathFinding {
    constructor() {
        generateQueryConstructor.call(this, ...arguments)
    }
    generateHelperGrid() {
        const { grid: { gridcells, numRows, numCols } } = this
        const helperGrid = []

        for (let row = 0; row < numRows; row++) {
            const helperRow = []

            for (let col = 0; col < numCols; col++) {
                const position = `${row}-${col}`
                const cell = gridcells[position]
                helperRow.push(cell.isBlocked ? 1 : 0)
            }
            helperGrid.push(helperRow)
        }
        return helperGrid
    }
    generateHelperPath() {
        const helperGrid = this.generateHelperGrid()
        const pathFindingGrid = new PathFindingGrid(helperGrid)

        const outColRow = this.generateColRow(this.outCell.position)
        const inColRow = this.generateColRow(this.inCell.position)

        const bfsStartFinder = new BreadthFirstFinder({ grid: this, weight: this.grid.settings.verticesWeight })

        const helperPath = bfsStartFinder.findPath(
            ...outColRow,
            ...inColRow,
            pathFindingGrid
        )
        return helperPath

    }
    generateColRow(position) {
        return position.split('-').map(item => parseInt(item)).reverse()
    }
}

export default GridPathFinding