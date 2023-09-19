import { useEffect, useState } from "react";
import { baseUrl } from "./config";
import { Input, Table, Button, Modal } from 'antd';

const { Search } = Input;

function App() {
  const subForm  : { [key: string]: any } = 
  {
    "Date": "",
    "Client": "",
    "Project": "",
    "Project Code": "",
    "Hours": "",
    "Billable?": "",
    "First Name": "",
    "Last Name": "",
    "Billable Rate": "",
  }

  const [table, setTable] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(true);
  const [formData, setFormData] = useState(subForm);
  const [formError, setFormError] = useState("");
  
  useEffect(() => {
    fetch(`${baseUrl}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data)
        setTable(data);
      });
  }, []);
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'Project',
      key: 'Project',
    },
    {
      title: 'Client',
      dataIndex: 'Client',
      key: 'Client',
    },
    {
      title: 'Hours',
      dataIndex: 'Hours',
      key: 'Hours',
    },
    {
      title: 'Billable Hours',
      dataIndex: 'Hours',
      key: 'Hours',
      render: (_: any, record: any) => {return record["Billable?"].toLowerCase() === "yes" ? <>{record["Hours"]} (100%)</> : <>0.00 (0%)</>},
    },
    {
      title: 'Billable Amount',
      dataIndex: 'Billable Rate',
      key: 'Billable Rate',
      render: (_: any, record: any) => {return record["Billable?"].toLowerCase() === "yes" ? <>${(record["Billable Rate"] * record["Hours"]).toFixed(2)}</> : <>-</>},
    },
  ]

  function onSearch(value: any){
    fetch(`${baseUrl}/${value}`)
      .then((resp) => resp.json())
      .then((data) => {
        setTable(data);
      });
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log(formData)
    let x = "";
    for(let key in formData){
      if(formData[key].length === 0){
        x = "PLEASE FILL ALL REQUIRED FIELDS";
      }else if(key === "Billable?"){
        if(formData[key].toLowerCase() != "yes" && formData[key].toLowerCase() != "no"){
          x = "PLEASE SET BILLABLE TO BE YES OR NO";
        }
      }
    }

    if(x === ""){
      setModalText(false);
      setConfirmLoading(true);
      fetch(`${baseUrl}/add`,{
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)})
        .then((resp) => resp.json())
        .then((data) => {
          setModalText(true);
          setIsModalOpen(false);
          setConfirmLoading(false);
          setFormError("")
          setFormData(subForm)
        });
    }else{
      setFormError(x)
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{margin:'5%'}}>
      <h3 style={{marginBottom:'10px'}}>Search for Client</h3>
      <Search style={{width:'100%', marginBottom:'2%'}} placeholder="search client (case sensitive)" allowClear onSearch={onSearch} />
      <Table columns={columns} dataSource={table} />
      <Button type="primary" onClick={showModal}>
        Add New Client
      </Button>
      <Modal title="Add New Client" 
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}>
          {modalText ? <div>
            <label>Date</label>
            <Input placeholder="Date" type="date" value={formData.Date} onChange={ e => setFormData({ ...formData, "Date": e.target.value})}/>
            <label>Client</label>
            <Input placeholder="Client Name" value={formData.Client} onChange={ e => setFormData({ ...formData, "Client": e.target.value})} />
            <label>Project</label>
            <Input placeholder="Project Name" value={formData.Project} onChange={ e => setFormData({ ...formData, "Project": e.target.value})} />
            <label>Project Code</label>
            <Input placeholder="123" value={formData["Project Code"]} onChange={ e => setFormData({ ...formData, "Project Code": e.target.value})} />
            <label>Hours</label>
            <Input placeholder="0" type="number" value={formData.Hours} onChange={ e => setFormData({ ...formData, "Hours": e.target.value})}/>
            <label>Billable</label>
            <Input placeholder="Yes" value={formData["Billable?"]} onChange={ e => setFormData({ ...formData, "Billable?": e.target.value})} />
            <label>First Name</label>
            <Input placeholder="John" value={formData["First Name"]} onChange={ e => setFormData({ ...formData, "First Name": e.target.value})} />
            <label>Last Name</label>
            <Input placeholder="Doe" value={formData["Last Name"]} onChange={ e => setFormData({ ...formData, "Last Name": e.target.value})} />
            <label>Billable Rate</label>
            <Input placeholder="0.00" type="number" value={formData["Billable Rate"]} onChange={ e => setFormData({ ...formData, "Billable Rate": e.target.value})} />
            <h3>{formError}</h3>
          </div> :
          <h2>Wait until client is finished being added...</h2>}
      </Modal>
    </div>
  );
}

export default App;