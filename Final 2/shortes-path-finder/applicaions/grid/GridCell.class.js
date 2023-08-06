import { generateQueryConstructor } from "../utils/objext.utils.js";

class GridCell {
    constructor() {
        generateQueryConstructor.call(this, ...arguments)
    }
    get position() {
        return `${this.row}-${this.col}`
    }
    get gridcellElement() {
        return document.querySelector(`.gridcell[position="${this.position}"]`)
    }
    render() {
        this.renderElement()
        this.renderGridCell()
        this.renderHtml()
        this.renderOutInCell()
        this.renderEvents()
    }
    renderElement() {
        const { grid: { gridElement } } = this
        const gridcellElement = document.createElement('div')
        gridcellElement.classList.add('gridcell')
        gridcellElement.setAttribute('position', this.position)

        gridElement.appendChild(gridcellElement)
    }
    renderGridCell() {
        const { grid: { numRows, numCols } } = this
        this.isBlocked = false;
        this.isOutCell = this.position == `0-0`
        this.isInCell = this.position == `${numRows-1}-${numCols-1}`
    }
    renderHtml() {
        const { gridcellElement, grid: { settings: { cellSize, borderSize, borderColor } } } = this

        Object.assign(gridcellElement.style, {
            width: `${ cellSize }px`,
            height: `${ cellSize }px`,
            border: `${ borderSize }px solid ${ borderColor }`

        })
        gridcellElement.setAttribute('draggable', true)
    }
    renderOutInCell() {
        this.gridcellElement.classList[this.isOutCell ? 'add' : 'remove']('out-cell')
        this.gridcellElement.classList[this.isInCell ? 'add' : 'remove']('in-cell')
    }
    renderBlockedCells() {
        this.gridcellElement.classList[this.isBlocked ? 'add' : 'remove']('blocked')
    }
    renderEvents() {
        this.renderClickEvent()
        this.renderHoverEvent()
        this.renderDragDropEvents()
    }
    renderClickEvent() {
        const { gridcellElement } = this

        gridcellElement.addEventListener('click', () => {
            if (this.isOutCell || this.isInCell) return
            this.isBlocked = !this.isBlocked
            this.renderBlockedCells()
            this.grid.draw()
        })
    }
    renderHoverEvent() {
        const { gridcellElement } = this

        gridcellElement.addEventListener('mouseover', () => {
            if (this.isInCell || this.isOutCell) {
                gridcellElement.style.cursor = 'grab'
            } else if (!this.isBlocked) {
                gridcellElement.style.cursor = 'pointer'
            } else {
                gridcellElement.style.cursor = 'crosshair'
            }
        })
    }
    renderDragDropEvents() {
        const { gridcellElement, grid } = this

        gridcellElement.addEventListener('dragover', event => {
            if (dontAllowDrop.call(this)) return
            event.preventDefault()
        })
        gridcellElement.addEventListener('dragstart', event => {
            if (dontAllowDrag.call(this)) {
                event.preventDefault()
                return
            }
            grid.draggedGridCell = this
        })

        gridcellElement.addEventListener('drop', _ => {

            this.resetCell()

            this.isInCell = grid.draggedGridCell.isInCell
            this.isOutCell = grid.draggedGridCell.isOutCell

            this.renderOutInCell()
            grid.draggedGridCell.resetCell()
            grid.draw()
        })

        function dontAllowDrop() {
            const { gridcellElement, grid } = this

            if (grid.draggedGridCell.gridcellElement === gridcellElement) return true
            if (grid.draggedGridCell.isOutCell && this.isInCell) return true
            if (grid.draggedGridCell.isInCell && this.isOutCell) return true
            if (grid.draggedGridCell.isInCell && this.isBlocked) return true
            if (grid.draggedGridCell.isOutCell && this.isBlocked) return true

            return false
        }

        function dontAllowDrag() {
            return (!this.isOutCell && !this.isInCell)
        }
    }
    resetCell() {
        this.isBlocked = false
        this.isInCell = false
        this.isOutCell = false;

        this.renderOutInCell()
    }
}

export default GridCell