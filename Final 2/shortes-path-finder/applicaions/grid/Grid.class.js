    import { generateQueryConstructor } from '../utils/objext.utils.js'
    import GridCell from './GridCell.class.js'
    import GridDraw from './GridDraw.class.js'
    class Grid {
        constructor() {
            generateQueryConstructor.call(this, ...arguments)
        }

        get gridElement() {
            return document.querySelector(this.settings.gridSelector)
        }

        get svgElement() {
            return document.querySelector(this.settings.svgSelector)
        }

        build() {
            this.buildGridLayout()
            this.buildGridCells()
            this.buildGridSvg()
        }
        
        buildGridLayout() {
            const { settings, gridElement } = this
            const { cellSize, borderSize, borderColor } = this.settings
            const { innerWidth, innerHeight } = window

            const fullCellSize = cellSize + borderSize * 2

            this.numCols = Math.floor((3 * innerWidth) / (4 * fullCellSize))
            this.numRows = Math.floor((4 * innerHeight) / (5 * fullCellSize))

            this.gridWidth = this.numCols * fullCellSize
            this.gridHeight = this.numRows * fullCellSize

            this.gridMarginX = (innerWidth - this.gridWidth - borderSize * 2) / 2
            this.gridMarginY = (innerHeight - this.gridHeight - borderSize * 2) / 2

            Object.assign(gridElement.style, {
                width: `${ this.gridWidth }px`,
                height: `${ this.gridHeight }px`,

                marginLeft: `${ this.gridMarginX }px`,
                marginTop: `${ this.gridMarginY }px`,

                border: `${ borderSize }px solid ${ borderColor }`

            })

        }

        buildGridCells() {
            const { numRows, numCols } = this
            this.gridcells = {}
            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {

                    const gridcell = new GridCell({ grid: this, row: row, col: col })
                    gridcell.render()

                    this.gridcells[gridcell.position] = gridcell
                }
            }
        }
        buildGridSvg() {
            const { svgElement, gridWidth, gridHeight } = this

            Object.assign(svgElement.style, {
                width: `${gridWidth}px`,
                height: `${gridHeight}px`,
                left: `${this.gridMarginX}px`,
                top: `${this.gridMarginY}px`
            })

            svgElement.setAttribute('viewbox', `0 0 ${gridWidth} ${gridHeight}`)
        }
        draw() {
            const gridDraw = new GridDraw({ grid: this })
            gridDraw.draw()
        }

    }

    export default Grid





    