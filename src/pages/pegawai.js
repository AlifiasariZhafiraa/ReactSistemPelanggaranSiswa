import React from 'react'
import axios from 'axios'
import {Button,Modal, Table, Card} from 'react-bootstrap' 

class Pegawai extends React.Component {
    constructor() {  
        super();  
        this.state = {
            pegawai: [],  
          isModal10open: false
        }  
    }
    handleAdd = () => {
        this.setState({
            isModalOpen: true
        })
    }
    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }
    getPegawai = () => {
        let url = "http://localhost:2910/pegawai";
        // mengakses api untuk mengambil data pegawai
        axios.get(url)
        .then(response => {
          // mengisikan data dari respon API ke array pegawai
          this.setState({pegawai: response.data.pegawai});
        })
        .catch(error => {
          console.log(error);
        });
    }
    componentDidMount(){
        // method yang pertama kali dipanggil pada saat load page
        this.getPegawai()
    }
    render(){
        console.log(this.state.pegawai)
        return(
            <>
                <Card>
                <Card.Header className="card-header bg-info text-white" align={'center'}>Data Pegawai</Card.Header>
                <Card.Body>
                <input type="text" className="form-control mb-2" name="search" value={this.state.search} onChange={this.bind} onKeyUp={this.findPegawai} placeholder="Pencarian..." />
                <Button variant="success" onClick={this.handleAdd}>
                    Tambah Data
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>  
                            <th>Nama</th>  
                            <th>Alamat</th>  
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.pegawai.map((item,index) => {  
                        return (  
                        <tr key={index}>  
                            <td>{item.id_pegawai}</td>  
                            <td>{item.nama_pegawai}</td>  
                            <td>{item.alamat}</td>  
                            <td>  
                            <Button className="btn btn-sm btn-info m-1" data-toggle="modal"  
                            data-target="#modal" onClick={() => this.handleEdit(item)}>  
                                Edit  
                            </Button>  
                            <Button className="btn btn-sm btn-danger m-1" onClick={() => this.Drop(item.id_pegawai)}>  
                                Hapus  
                            </Button>  
                            </td>  
                        </tr>  
                        );  
                    })}
                    </tbody>
                    </Table>
                </Card.Body>
                </Card>
                <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Form Pegawai</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        ini Body
                    </Modal.Body>
                    <Modal.Footer>
                        ini Footer
                    </Modal.Footer>
                </Modal>
            </>
    );  
  }
}

export default Pegawai
