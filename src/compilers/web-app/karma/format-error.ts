export default function (message: string) {
  let hasSeenStack = false
  console.log('formatting error...')
  return message
    .split('\n')
    .reduce((list: Array<string>, line: string) => {
      // filter out node_modules
      if (/~/.test(line)) return list

      // indent the error beneath the it() message
      let newLine = '  ' + line

      if (newLine.includes('webpack:///')) {
        if (hasSeenStack === false) {
          const indent = newLine.slice(0, newLine.search(/\S/))
          newLine = `\n${indent}Stack:\n${newLine}`
          hasSeenStack = true
        }

        // remove webpack:///
        newLine = newLine.replace('webpack:///', '')

        // remove bundle location, showing only the source location
        newLine = newLine.slice(0, newLine.indexOf(' <- '))
      }

      return list.concat(newLine)
    }, [])
    .join('\n')
}
