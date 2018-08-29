import React, { Component } from 'react'
import { View, TextInput, StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Button from './Button'
import { calcSize } from '../utils'
import PropTypes from 'prop-types'

export default class NumericInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.initValue,
            stringValue: props.initValue.toString(),
        }
        this.ref = null
    }
    inc = () => {
        let value = this.props.value && (typeof this.props.value === 'number') ? this.props.value : this.state.value
        if (this.props.maxValue === null || (value < this.props.maxValue)) {
            value += this.props.step
            this.setState({ value })
        }
        if (value !== this.props.value)
            this.props.onChange && this.props.onChange(value)

    }
    dec = () => {
        let value = this.props.value && (typeof this.props.value === 'number') ? this.props.value : this.state.value
        if (this.props.minValue === null || (value > this.props.minValue)) {
            value -= this.props.step
            this.setState({ value })
        }
        if (value !== this.props.value)
            this.props.onChange && this.props.onChange(value)
    }
    onChange = (value) => {
        let currValue = typeof this.props.value === 'number' ? this.props.value : this.state.value
        let realMatch = value && value.match(/\d+(\.(\d+)?)?/) && value.match(/\d+(\.(\d+)?)?/)[0] === value.match(/\d+(\.(\d+)?)?/).input,
            intMatch = value && value.match(/\d+/) && value.match(/\d+/)[0] === value.match(/\d+/).input,
            legal = value === '' || (((this.props.valueType === 'real' && realMatch) || (this.props.valueType !== 'real' && intMatch)) && (this.props.maxValue === null || (parseFloat(value) <= this.props.maxValue)) && (this.props.minValue === null || (parseFloat(value) >= this.props.minValue)))
        if (!legal) {
            if (this.ref) {
                this.ref.blur()
                setTimeout(() => {
                    this.ref.clear()
                    setTimeout(() => {
                        this.props.onChange && this.props.onChange(currValue - 1)
                    this.setState({ value: currValue - 1 }, () => {
                        this.setState({ value: currValue })
                        this.props.onChange && this.props.onChange(currValue)
                    })},10)
                }, 15)
                setTimeout(() => this.ref.focus(), 20)

            }
        } else {
            this.setState({stringValue:value})
            let parsedValue = this.props.valueType === 'real' ? parseFloat(value) : parseInt(value)
            parsedValue = isNaN(parsedValue) ? 0 : parsedValue
                if (parsedValue !== this.props.value)
                    this.props.onChange && this.props.onChange(parsedValue)
                this.setState({ value: parsedValue })
         
        }
    }
    onBlur = () => {
        let match = this.state.stringValue.match(/\d+(\.\d+)?/)
        let legal = match && match[0] === match.input
        let currValue = typeof this.props.value === 'number' ? this.props.value : this.state.value
        if(!legal){
            if (this.ref) {
                this.ref.blur()
                setTimeout(() => {
                    this.ref.clear()
                    setTimeout(() => {
                        this.props.onChange && this.props.onChange(currValue - 1)
                    this.setState({ value: currValue - 1 }, () => {
                        this.setState({ value: currValue,stringValue:currValue.toString() })
                        this.props.onChange && this.props.onChange(currValue)
                    })},10)
                }, 15)
                setTimeout(() => this.ref.focus(), 20)

            }
        }
        this.props.onBlur && this.props.onBlur()
    }

    render() {
        const editable = this.props.editable
        const sepratorWidth = this.props.sepratorWidth
        const iconSize = this.props.iconSize
        const borderColor = this.props.borderColor
        const iconStyle = [style.icon, this.props.iconStyle]
        const totalWidth = this.props.totalWidth
        const totalHeight = this.props.totalHeight ? this.props.totalHeight : (totalWidth * 0.4)
        const inputWidth = this.props.type === 'up-down' ? (totalWidth * 0.6) : (totalWidth * 0.4)
        const paddingRight = totalWidth * 0.18
        const borderRadiusTotal = totalHeight * 0.18
        const fontSize = totalHeight * 0.38
        const textColor = this.props.textColor
        const inputContainerStyle = this.props.type === 'up-down' ?
            [style.inputContainerUpDown, { width: totalWidth, height: totalHeight, borderColor: borderColor }, this.props.rounded ? { borderRadius: borderRadiusTotal } : {}, this.props.containerStyle] :
            [style.inputContainerPlusMinus, { width: totalWidth, height: totalHeight, borderColor: borderColor }, this.props.rounded ? { borderRadius: borderRadiusTotal } : {}, this.props.containerStyle]
        const inputStyle = this.props.type === 'up-down' ?
            [style.inputUpDown, { width: inputWidth, height: totalHeight, fontSize: fontSize, color: textColor, borderRightWidth: 2, borderRightColor: borderColor }, this.props.inputStyle] :
            [style.inputPlusMinus, { width: inputWidth, height: totalHeight, fontSize: fontSize, color: textColor, borderRightWidth: sepratorWidth, borderLeftWidth: sepratorWidth, borderLeftColor: borderColor, borderRightColor: borderColor }, this.props.inputStyle]
        const upDownStyle = [{ alignItems: 'center', width: totalWidth - inputWidth, backgroundColor: this.props.upDownButtonsBackgroundColor, borderRightWidth: 1, borderRightColor: borderColor }, this.props.rounded ? { borderTopRightRadius: borderRadiusTotal, borderBottomRightRadius: borderRadiusTotal } : {}]
        const rightButtonStyle = [
            {
                position: 'absolute',
                zIndex: -1,
                right: 0,
                height: totalHeight - 2,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 0,
                backgroundColor: this.props.rightButtonBackgroundColor,
                width: (totalWidth - inputWidth) / 2
            },
            this.props.rounded ?
                {
                    borderTopRightRadius: borderRadiusTotal,
                    borderBottomRightRadius: borderRadiusTotal
                }
                : {}]
        const leftButtonStyle = [
            {
                position: 'absolute',
                zIndex: -1,
                left: 0,
                height: totalHeight - 2,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: this.props.leftButtonBackgroundColor,
                width: (totalWidth - inputWidth) / 2,
                borderWidth: 0
            },
            this.props.rounded ?
                { borderTopLeftRadius: borderRadiusTotal, borderBottomLeftRadius: borderRadiusTotal }
                : {}]
        const value = typeof this.props.value === 'number' ? this.props.value : this.state.value
        const inputWraperStyle = {
            alignSelf: 'center',
            borderLeftColor: borderColor,
            borderLeftWidth: sepratorWidth,
            borderRightWidth: sepratorWidth,
            borderRightColor: borderColor
        }
        if (this.props.type === 'up-down')
            return (
                <View style={inputContainerStyle}>
                    <TextInput editable={editable} returnKeyType='done' underlineColorAndroid='rgba(0,0,0,0)' keyboardType='numeric' value={value.toString()} onChangeText={this.onChange} style={inputStyle} ref={ref => this.ref = ref} onBlur={this.onBlur}/>
                    <View style={upDownStyle}>
                        <Button onPress={this.inc} style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                            <Icon name='ios-arrow-up' size={fontSize} style={iconStyle} />
                        </Button>
                        <Button onPress={this.dec} style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                            <Icon name='ios-arrow-down' size={fontSize} style={iconStyle} />
                        </Button>
                    </View>
                </View>)
        else return (
            <View style={inputContainerStyle}>
                <Button onPress={this.dec} style={leftButtonStyle}>
                    <Icon name='md-remove' size={fontSize} style={iconStyle} />
                </Button>
                <View style={[inputWraperStyle]}>
                    <TextInput editable={editable} returnKeyType='done' underlineColorAndroid='rgba(0,0,0,0)' keyboardType='numeric' value={value.toString()} onChangeText={this.onChange} style={inputStyle} ref={ref => this.ref = ref} />
                </View>
                <Button onPress={this.inc} style={rightButtonStyle}>
                    <Icon name='md-add' size={fontSize} style={iconStyle} />
                </Button>
            </View>)


    }
}

const style = StyleSheet.create({
    seprator: {
        backgroundColor: 'grey',
        height: calcSize(80),
    },
    inputContainerUpDown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderColor: 'grey',
        borderWidth: 1
    },
    inputContainerPlusMinus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    },
    inputUpDown: {
        textAlign: 'center',
        padding: 0

    },
    inputPlusMinus: {
        textAlign: 'center',
        padding: 0
    },
    icon: {
        fontWeight: '900',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    upDown: {
        alignItems: 'center',
        paddingRight: calcSize(15)
    }
})
NumericInput.propTypes = {
    iconSize: PropTypes.number,
    borderColor: PropTypes.string,
    iconStyle: PropTypes.any,
    totalWidth: PropTypes.number,
    totalHeight: PropTypes.number,
    sepratorWidth: PropTypes.number,
    type: PropTypes.oneOf(['up-down', 'plus-minus']),
    valueType: PropTypes.oneOf(['real', 'integer']),
    rounded: PropTypes.any,
    textColor: PropTypes.string,
    containerStyle: PropTypes.any,
    inputStyle: PropTypes.any,
    initValue: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    step: PropTypes.number,
    upDownButtonsBackgroundColor: PropTypes.string,
    rightButtonBackgroundColor: PropTypes.string,
    leftButtonBackgroundColor: PropTypes.string,
    editable: PropTypes.bool,
}
NumericInput.defaultProps = {
    iconSize: calcSize(30),
    borderColor: '#d4d4d4',
    iconStyle: {},
    totalWidth: calcSize(220),
    sepratorWidth: 1,
    type: 'plus-minus',
    rounded: false,
    textColor: 'black',
    containerStyle: {},
    inputStyle: {},
    initValue: 0,
    valueType: 'integer',
    value: null,
    minValue: null,
    maxValue: null,
    step: 1,
    upDownButtonsBackgroundColor: 'white',
    rightButtonBackgroundColor: 'white',
    leftButtonBackgroundColor: 'white',
    editable: true,

}
