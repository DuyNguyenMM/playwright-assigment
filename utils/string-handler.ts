const getNumberInString = (inputString: string): number[] => {
    const numberRegex: RegExp = /\d+/g;
    let numericValues: number[] = []
    const extractedNumbers: string[] | null = inputString.match(numberRegex);
    if (extractedNumbers) {
        numericValues = extractedNumbers.map(Number);
        
    }
     return numericValues;
}

export { getNumberInString }