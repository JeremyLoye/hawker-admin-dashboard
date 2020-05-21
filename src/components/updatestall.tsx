import React from "react";
import { Modal, List, Segment, Grid, Header, Divider, Form, Input, Container, Button, InputProps, DropdownProps, Dropdown, ButtonProps, TransitionablePortal } from 'semantic-ui-react';
import API from './axiosapi';

type Props = {
    stall: {
        name: string,
        stallId: string,
        stallNo: string,
        location: string,
        image: string,
        food: any[],
        about: any,
        contact: any,
        type: string[]
    }
}

class UpdateStall extends React.Component<Props> {
    state = {
        ...this.props.stall,
        activeFoodItem: this.props.stall.food.length>0 ? 1 : 0,
        newFoodItemName: "",
        newFoodItemPrice: 0,
        newFoodItemMargin: 0,
        newFoodItemDescription: "",
        newFoodItemImage: "",
        portal: false,
        aboutImage: "",
        aboutUrl: ""
    }

    componentDidMount() { 
    }

    handleNameChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        this.setState({name: data.value})
    }
    handleImageUrlChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        this.setState({image: data.value})
    }
    handleTypeChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        this.setState({type: data.value})
    }
    handleFoodSelectionChange = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        this.setState({activeFoodItem: data.value})
    }
    handleFoodNameChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        const foodList = this.state.food
        this.state.food.forEach((food, index) => {
            if (food.id === this.state.activeFoodItem) {
                foodList[index]['name'] = data.value
            }
        })
        this.setState({food: foodList})
    }
    handleFoodPriceChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        const foodList = this.state.food
        this.state.food.forEach((food, index) => {
            if (food.id === this.state.activeFoodItem) {
                foodList[index]['price'] = parseFloat(data.value)
            }
        })
        this.setState({food: foodList})
    }
    handleFoodMarginChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        const foodList = this.state.food
        this.state.food.forEach((food, index) => {
            if (food.id === this.state.activeFoodItem) {
                foodList[index]['margin'] = parseFloat(data.value)
            }
        })
        this.setState({food: foodList})
    }
    handleFoodDescriptionChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        const foodList = this.state.food
        this.state.food.forEach((food, index) => {
            if (food.id === this.state.activeFoodItem) {
                foodList[index]['description'] = data.value
            }
        })
        this.setState({food: foodList})
    }
    handleFoodImageChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        const foodList = this.state.food
        this.state.food.forEach((food, index) => {
            if (food.id === this.state.activeFoodItem) {
                foodList[index]['image'] = data.value
            }
        })
        this.setState({food: foodList})
    }
    deleteFoodItem = (event: React.SyntheticEvent<HTMLElement>, data: ButtonProps) => {
        const foodList = this.state.food.filter(food=>food.id!=this.state.activeFoodItem)
        foodList.forEach((food, index) => {
            if (food.id > this.state.activeFoodItem) {
               foodList[index]['id'] -= 1
            }
        })
        if (this.state.activeFoodItem > foodList.length) {
            const new_index = this.state.activeFoodItem-1
            this.setState({activeFoodItem: new_index, food: foodList})
        } else {
            this.setState({food: foodList})
        } 
    }
    handleNewFoodNameChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        this.setState({newFoodItemName: data.value})
    }
    handleNewFoodPriceChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        this.setState({newFoodItemPrice: parseFloat(data.value)})
    }
    handleNewFoodMarginChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        this.setState({newFoodItemMargin: parseFloat(data.value)})
    }
    handleNewFoodDescriptionChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        this.setState({newFoodItemDescription: data.value})
    }
    handleNewFoodImageChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        this.setState({newFoodItemImage: data.value})
    }
    addFoodItem = (event: React.SyntheticEvent<HTMLElement>, data: ButtonProps) => {
        let newId = Math.max(...this.state.food.map(({ id }) => id))+1
        if (this.state.food.length === 0) {
            newId = 1
        }
        const foodList = this.state.food
        foodList.push({
            id: newId,
            name: this.state.newFoodItemName,
            price: this.state.newFoodItemPrice,
            margin: this.state.newFoodItemMargin,
            description: this.state.newFoodItemDescription,
            image: this.state.newFoodItemImage,
            available: true
        })
        this.setState({
            food: foodList,
            newFoodItemName: "",
            newFoodItemPrice: 0,
            newFoodItemMargin: 0,
            newFoodItemDescription: "",
            newFoodItemImage: ""
        })
        if (this.state.activeFoodItem === 0) {
            this.setState({activeFoodItem: 1})
        } 
    }
    handleAboutDescriptionChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        let about = this.state.about
        about['description'] = data.value
        this.setState({about: about})
    }
    handleAboutRecommendedChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        let about = this.state.about
        about['recommended'] = data.value
        this.setState({about: about})
    }
    handleAboutImageChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        this.setState({aboutImage: data.value})
    }
    addAboutImage = (event: React.SyntheticEvent<HTMLElement>, data: ButtonProps) => {
        const about = this.state.about
        about['images'].push(this.state.aboutImage)
        this.setState({about, aboutImage: ""})
    }
    removeAboutImage = (event: React.SyntheticEvent<HTMLElement>, removeImage: string) => {
        let about = this.state.about
        about['images'] = this.state.about.urls.filter((url:string)=>url!==removeImage)
        this.setState({about})
    }
    handleAboutUrlChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        this.setState({aboutUrl: data.value})
    }
    addAboutUrl = (event: React.SyntheticEvent<HTMLElement>, data: ButtonProps) => {
        const about = this.state.about
        about['urls'].push(this.state.aboutUrl)
        this.setState({about, aboutUrl: ""})
    }
    removeAboutUrl = (event: React.SyntheticEvent<HTMLElement>, removeUrl: string) => {
        let about = this.state.about
        about['urls'] = this.state.about.urls.filter((url:string)=>url!==removeUrl)
        this.setState({about})
    }
    handleContactPocChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        let contact = this.state.contact
        contact['poc'] = data.value
        this.setState({contact})
    }
    handleContactOpeningHoursChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        let contact = this.state.contact
        contact['openingHours'] = data.value
        this.setState({contact})
    }
    handleContactNumberChange = (event: React.SyntheticEvent<HTMLElement>, data: InputProps) => {
        let contact = this.state.contact
        contact['number'] = data.value
        this.setState({contact})
    }

    submitUpdates = (event: React.SyntheticEvent<HTMLElement>, data: ButtonProps) => {
        const promise: Promise<any> = API.post(`/stalls/${this.state.stallId}/update`, {
            "name": this.state.name,
            "image": this.state.image,
            "type": this.state.type,
            "food": this.state.food,
            "about": this.state.about,
            "contact": this.state.contact
        })
        promise.then((res)=>{
            if ("success" in res['data']) {
                this.setState({portal: true})
            }
        })
    }

    deleteStall = (event: React.SyntheticEvent<HTMLElement>, data: ButtonProps) => {
        const promise: Promise<any> = API.post(`/stalls/${this.state.stallId}/delete`)
        promise.then((res)=>{
            if ("success" in res['data']) {
                window.location.reload(false);
            }
        })
    }

    render() {
        return(
            <Container>
                <h1>Updating {this.state.name}</h1>
                <Modal size="tiny" trigger={
                    <Button negative>Delete</Button>}
                    header="WARNING"
                    content={`This action cannot be undone! Are you sure you want to delete #${this.state.stallNo} ${this.state.name}?`}
                    actions={["Cancel", { key:'delete', content:'Delete', onClick:this.deleteStall, negative: true}]}/>
                <Divider hidden/>
                <Divider horizontal>
                    <Header as='h3'>General Information</Header>
                </Divider>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Field
                            required
                            value={this.state.name}
                            control={Input}
                            label='Stall Name'
                            placeholder='Stall Name'
                            onChange={this.handleNameChange}/>
                        <Form.Field
                            value={this.state.image}
                            control={Input}
                            label='Stall Image URL'
                            placeholder='Image URL'
                            onChange={this.handleImageUrlChange}/>
                        <Form.Field
                            disabled
                            value={this.state.location}
                            control={Input}
                            label='Location Code'
                            placeholder='Location'/>
                        <Form.Field
                            disabled
                            value={`#${this.state.stallNo}`}
                            control={Input}
                            label='Stall Unit Number'
                            placeholder='Stall #'/>
                    </Form.Group>
                    <Dropdown
                        placeholder='Stall Type'
                        fluid multiple selection
                        options={typeOptions}
                        value={this.state.type}
                        onChange={this.handleTypeChange}/>
                    <Divider hidden/>
                    <Divider horizontal>
                        <Header as='h3'>Edit Existing Food Items</Header>
                    </Divider>
                    { this.state.activeFoodItem>0 ?
                    <Grid columns={2}>
                        <Grid.Column width={6} verticalAlign="middle">
                            Editing Item:
                            <Dropdown
                                placeholder="Food Item"
                                selection
                                options={
                                    this.state.food.map((food) => {
                                        return {
                                            key: food.id,
                                            text: food.name,
                                            value: food.id
                                        }
                                    })
                                }
                                value={this.state.activeFoodItem}
                                onChange={this.handleFoodSelectionChange}/>
                            <Divider hidden/>
                            <Button onClick={this.deleteFoodItem} negative>Delete</Button>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Form.Group widths='equal'>
                                <Form.Field
                                    value={this.state.food[this.state.activeFoodItem-1]['name']}
                                    control={Input}
                                    label="Food Name"
                                    placeholder="Food Name"
                                    onChange={this.handleFoodNameChange}/>
                                <Form.Field
                                    value={this.state.food[this.state.activeFoodItem-1]['price']}
                                    control={Input}
                                    label="Price"
                                    placeholder="$"
                                    onChange={this.handleFoodPriceChange}
                                    type='number'/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field
                                    value={this.state.food[this.state.activeFoodItem-1]['margin']}
                                    control={Input}
                                    label="Margin"
                                    placeholder="$"
                                    onChange={this.handleFoodMarginChange}
                                    type='number'/>
                                <Form.Field
                                    value={this.state.food[this.state.activeFoodItem-1]['image']}
                                    control={Input}
                                    label="Food Image URL"
                                    placeholder="Image URL"
                                    onChange={this.handleFoodImageChange}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field
                                    value={this.state.food[this.state.activeFoodItem-1]['description']}
                                    control={Input}
                                    label="Food Description"
                                    placeholder="Description"
                                    onChange={this.handleFoodDescriptionChange}/>
                            </Form.Group>
                        </Grid.Column>
                    </Grid> : <h2>There are no food items registered currently</h2> }
                    <Divider horizontal>
                        <Header as='h3'>Add New Food Item</Header>
                    </Divider>
                    <Grid columns={2}>
                        <Grid.Column width={6} verticalAlign="middle">
                            <Button disabled={this.state.newFoodItemName.length===0} onClick={this.addFoodItem} positive>Add</Button>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Form.Group widths='equal'>
                                <Form.Field
                                    value={this.state.newFoodItemName}
                                    control={Input}
                                    label="Food Name"
                                    placeholder="Food Name"
                                    onChange={this.handleNewFoodNameChange}/>
                                <Form.Field
                                    value={this.state.newFoodItemPrice}
                                    control={Input}
                                    label="Price"
                                    placeholder="$"
                                    onChange={this.handleNewFoodPriceChange}
                                    type='number'/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field
                                    value={this.state.newFoodItemMargin}
                                    control={Input}
                                    label="Margin"
                                    placeholder="$"
                                    onChange={this.handleNewFoodMarginChange}
                                    type='number'/>
                                <Form.Field
                                    value={this.state.newFoodItemImage}
                                    control={Input}
                                    label="Food Image URL"
                                    placeholder="Image URL"
                                    onChange={this.handleNewFoodImageChange}/>
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field
                                    value={this.state.newFoodItemDescription}
                                    control={Input}
                                    label="Food Description"
                                    placeholder="Description"
                                    onChange={this.handleNewFoodDescriptionChange}/>
                            </Form.Group>
                        </Grid.Column>
                    </Grid>
                    <Divider horizontal>
                        <Header as='h3'>About</Header>
                    </Divider>
                    <Form.Group widths='equal'>
                        <Form.Field
                            value={this.state.about.description}
                            control={Input}
                            label="About Page Description"
                            placeholder="Stall Description"
                            onChange={this.handleAboutDescriptionChange}/>
                        <Form.Field
                            value={this.state.about.recommended}
                            control={Input}
                            label="Recommended Dishes"
                            placeholder="e.g. Laksa, Chendol"
                            onChange={this.handleAboutRecommendedChange}/>
                    </Form.Group>
                    <Divider hidden/>
                    <Grid columns={2}>
                        <Grid.Column width={6}>
                            <Form.Field
                                value={this.state.aboutImage}
                                control={Input}
                                label="Add images for About page"
                                placeholder="Image URL"
                                onChange={this.handleAboutImageChange}/>
                            <Button disabled={this.state.aboutImage===""} onClick={this.addAboutImage} positive>Add Image</Button>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Header as='h5'>Current Images</Header>
                            {this.state.about.images.length>0?
                                <List celled>
                                    {this.state.about.images.map((url:string)=>{
                                        return(
                                        <List.Item key={url}>
                                            <List.Content floated='right' verticalAlign='middle'>
                                                <Button onClick={(e)=>this.removeAboutImage(e, url)} size='mini' negative>Remove</Button>
                                            </List.Content>
                                            <List.Content floated='left' verticalAlign='middle'>
                                                <a>{url.length>44?url.substring(0,41)+"...":url}</a>
                                            </List.Content>
                                        </List.Item>)
                                    })}
                                </List>:"There are no images currently"}
                        </Grid.Column>
                    </Grid>
                    <Divider hidden/>
                    <Grid columns={2}>
                        <Grid.Column width={6}>
                            <Form.Field
                                value={this.state.aboutUrl}
                                control={Input}
                                label="Add URLs for About page"
                                placeholder="Reference URL"
                                onChange={this.handleAboutUrlChange}/>
                            <Button disabled={this.state.aboutUrl===""} onClick={this.addAboutUrl} positive>Add URL</Button>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Header as='h5'>Current URLs</Header>
                            {this.state.about.urls.length>0?
                                <List celled>
                                    {this.state.about.urls.map((url:string)=>{
                                        return(
                                            <List.Item key={url}>
                                            <List.Content floated='right' verticalAlign='middle'>
                                                <Button onClick={(e)=>this.removeAboutUrl(e, url)} size='mini' negative>Remove</Button>
                                            </List.Content>
                                            <List.Content floated='left' verticalAlign='middle'>
                                                <a>{url.length>44?url.substring(0,41)+"...":url}</a>
                                            </List.Content>
                                        </List.Item>)
                                    })}
                                </List>:"There are no URLs currently"}
                        </Grid.Column>
                    </Grid>
                    <Divider hidden/>
                    <Divider horizontal>
                        <Header as='h3'>Contact</Header>
                    </Divider>
                    <Form.Group widths='equal'>
                        <Form.Field
                            value={this.state.contact.poc}
                            control={Input}
                            label="Contact Person"
                            placeholder="POC"
                            onChange={this.handleContactPocChange}/>
                        <Form.Field
                            value={this.state.contact.openingHours}
                            control={Input}
                            label="Opening Hours"
                            placeholder="e.g. 0900-2000"
                            onChange={this.handleContactOpeningHoursChange}/>
                        <Form.Field
                            value={this.state.contact.number}
                            control={Input}
                            label="Phone Number"
                            placeholder="Number to contact"
                            onChange={this.handleContactNumberChange}/>
                    </Form.Group>
                    <TransitionablePortal open={this.state.portal}>
                        <Segment style={{ left: '45%', position: 'fixed', bottom: '5%', zIndex: 1000 }}>
                            <Header>Successfully Updated</Header>
                            <p>{this.state.name} has been updated</p>
                        </Segment>
                    </TransitionablePortal>
                    <Divider hidden/>
                    <Divider />
                    <Button disabled={
                        this.state.name==="" || this.state.food.length <= 0
                    } onClick={this.submitUpdates} positive>Update Stall</Button>
                    <Divider hidden/>
                </Form>
                
            </Container>
        )
    }
}

const typeOptions = [
    {
        key: "food",
        text: "Food",
        value: "Food"
    },
    {
        key: "drinks",
        text: "Drinks",
        value: "Drinks"
    },
    {
        key: "dessert",
        text: "Dessert",
        value: "Dessert" 
    },
    {
        key: "snacks",
        text: "Snacks",
        value: "Snacks"
    }
]

export default UpdateStall