const MasonryActiveClassName = 'masonry__active'

class Masonry {
    // Передаем элемент и опции
    constructor(element, options = {}) {
        // Сохраняем
        this.containerNode = element
        this.childrenNodes = element.children
        this.childrenData = Array.from(this.childrenNodes).map((childNode) => ({
            childNode,
            origHeight: Number(childNode.dataset.height),
            origWidth: Number(childNode.dataset.width),
        }))

        this.settings = {
            gap: options.gap || 0,
            columns: options.columns || 3,
        }
        this.documentElement = document.documentElement.clientWidth

        this.setParameters()
        this.containerNode.classList.add(MasonryActiveClassName)
    }
    setParameters() {
        const containerWidth = this.containerNode.offsetWidth

        const widthImage = (containerWidth - this.settings.gap * (this.settings.columns - 1)) / this.settings.columns

        this.childrenData = this.childrenData.map((child) => ({
            ...child,
            currentWidth: widthImage,
            currentHeight: Math.floor((widthImage * child.origHeight) / child.origWidth),
        }))

        const heightColumns = new Array(this.settings.columns).fill(0)
        const sizeColumns = new Array(this.settings.columns).fill(0)

        this.childrenData.forEach((child, i) => {
            heightColumns[i % this.settings.columns] += child.currentHeight + this.settings.gap
            sizeColumns[i % this.settings.columns] += 1
        })

        // Определяем минимум
        const minHeightColumn = heightColumns.reduce((acc, size) => (size < acc ? size : acc))

        // определяем высоту которую нужно обрезать
        const diffImages = heightColumns.map((heightColumn, i) => (heightColumn - minHeightColumn) / sizeColumns[i])

        this.containerNode.style.width = `${containerWidth}px`
        this.containerNode.style.height = `${minHeightColumn - this.settings.gap}px`

        const topSets = new Array(this.settings.columns).fill(0)

        this.childrenData = this.childrenData.map((child, i) => {
            const indexColumn = i % this.settings.columns
            const left = indexColumn * widthImage + this.settings.gap * indexColumn
            const currentHeight = child.currentHeight - diffImages[indexColumn]
            const top = topSets[indexColumn]
            topSets[indexColumn] += currentHeight + this.settings.gap

            return {
                ...child,
                currentHeight,
                left,
                top,
            }
        })

        this.childrenData.forEach((child) => {
            child.childNode.style.top = `${child.top}px`
            child.childNode.style.left = `${child.left}px`
            child.childNode.style.width = `${child.currentWidth}px`
            child.childNode.style.height = `${child.currentHeight}px`
        })
    }
}
if (document.getElementById('masonry')) {
    if (document.documentElement.clientWidth >= 1024) {
        const A = new Masonry(document.getElementById('masonry'), { gap: 10, columns: 4 })
    } else if (document.documentElement.clientWidth >= 768) {
        const B = new Masonry(document.getElementById('masonry'), { gap: 5, columns: 3 })
    } else if (document.documentElement.clientWidth >= 360) {
        const C = new Masonry(document.getElementById('masonry'), { gap: 5, columns: 2 })
    }
    // const masonry = new Masonry(document.getElementById('masonry'), { gap: 10, columns: 2 })
}
if (document.getElementById('masonryPlaylist')) {
    if (document.documentElement.clientWidth >= 1024) {
        const masonry = new Masonry(document.getElementById('masonryPlaylist'), { gap: 30, columns: 2 })
    } else {
        const masonry = new Masonry(document.getElementById('masonryPlaylist'), { gap: 10, columns: 1 })
    }
}
// TO-DO data atribute
// TO-DO class extend
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
