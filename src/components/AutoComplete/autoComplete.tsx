import React, { ChangeEvent, FC, KeyboardEvent, ReactElement, useEffect, useRef, useState } from "react";
import classNames from 'classnames';
import Input, { InputProps } from "../Input/input";
import Icon from "../Icon/icon";
import useDebounce from "../../hooks/useDebounce";
import useClickOutside from "../../hooks/useClickOutside";
interface DataSourceObject {
    value: string;
}
export type DataSourceType<T = {}> = T & DataSourceObject
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect' | 'onChange'> {
    onSelect?: (item: DataSourceType) => void
    renderOption?: (item: DataSourceType) => ReactElement
    fetchSuggestions: (keyword: string) => Promise<DataSourceType[]>
}

export const AutoComplete: FC<AutoCompleteProps> = (props) => {
    const { fetchSuggestions, onSelect, renderOption, value, ...restProps } = props
    const [inputValue, setInputValue] = useState(value)
    const [suggestions, setSuggestions] = useState<DataSourceType[]>([])
    const [ highlightIndex, setHighlightIndex] = useState(-1)
    const [ loading, setLoading ] = useState(false)
    const triggerSearch = useRef(false)
    const suggestionRef = useRef<HTMLUListElement>(null)
    const componentRef = useRef<HTMLDivElement>(null)
    const suggestionLen = useRef(0)
    const debouncedValue = useDebounce(inputValue, 500)
    useClickOutside(componentRef, () => {
        setSuggestions([])
        suggestionLen.current = 0
    })
    useEffect(() => {
        triggerSearch.current && getSuggestions()
    }, [debouncedValue])

    useEffect(() => {
        if (suggestionRef.current) {
            if (suggestionLen.current !== 0  || loading) {
                suggestionRef.current.classList.add('border-status')
            } else {
                suggestionRef.current.classList.remove('border-status')
            }
        }
    }, [suggestionLen.current, loading])

    const getSuggestions = async () => {
        suggestionLen.current = 0
        setSuggestions([])
        if (debouncedValue) {
            setLoading(true)
            const result = await fetchSuggestions(debouncedValue as string)
            setSuggestions(result)
            setLoading(false)
            suggestionLen.current = -1
        } else {
            setSuggestions([])
        }
        setHighlightIndex(-1)
    }
    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setInputValue(value)
        triggerSearch.current = true
    }
    const handleItemClick = (item: DataSourceType) => {
        setInputValue(item.value)
        setSuggestions([])
        suggestionLen.current = 0
        onSelect && onSelect(item)
        triggerSearch.current = false
    }
    const renderTemplate = (item: DataSourceType) => {
        return renderOption ? renderOption(item) : item.value
    }
    const generateDropdown = () => {
        return (
            <ul ref={suggestionRef} className="suggestion-list">
                { loading &&
                    <div className="suggstions-loading-icon">
                        <Icon icon="spinner" spin/>
                    </div>
                }
                {
                    suggestions.map((item, index) => {
                        const cnames = classNames('suggestion-item', {
                            'is-active': index === highlightIndex
                        })
                        return (
                            <li
                            key={index}
                            className={cnames}
                            onClick={() => { handleItemClick(item) }}
                            >
                                {renderTemplate(item)}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
    const highlight = (index: number) => {
        if (index< 0) {
            index = 0
        }
        if (index >= suggestions.length) {
            index = suggestions.length - 1
        }
        setHighlightIndex(index)
    }
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch(e.keyCode) {
            case 13:
                if (suggestions[highlightIndex]) {
                    handleItemClick(suggestions[highlightIndex])
                }
                break
            case 38:
                highlight(highlightIndex - 1)
                break
            case 40:
                highlight(highlightIndex + 1)
                break
            case 27:
                setSuggestions([])
                suggestionLen.current = 0
                break
            default:
                break
        }
    }
    return (
        <div ref={componentRef} className="auto-complete">
            <Input value={inputValue} {...restProps} onChange={handleChange} onKeyDown={handleKeyDown} />
            {generateDropdown()}
        </div>
    )
}

export default AutoComplete